'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeChartWithGemini } from '@/lib/geminiApi';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UploadZone from '@/components/UploadZone';
import AnalysisResultsComponent from '@/components/AnalysisResults';
import GlobalContextualQuery from '@/components/GlobalContextualQuery';
import { TextSelectionProvider } from '@/contexts/TextSelectionContext';
import { MenuIcon, ChartIcon, ResultsIcon } from '@/components/icons';

interface ChartImages {
  chart4h: File | null;
  chart1h: File | null;
  chart15m: File | null;
  chart5m: File | null;
}

interface UploadedImage {
  file: File;
  detectedTimeframe?: keyof ChartImages;
  error?: string;
}

interface AnalysisData {
  analysis4h?: string;
  analysis1h?: string;
  analysis15m?: string;
  analysis5m?: string;
  finalSuggestion?: string;
}

type AnalysisStep = '4h' | '1h' | '15min' | '5min' | 'final';

export default function TradingGuide() {
  const [images, setImages] = useState<ChartImages>({
    chart4h: null,
    chart1h: null,
    chart15m: null,
    chart5m: null,
  });
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [detectingTimeframes, setDetectingTimeframes] = useState(false);
  const [results, setResults] = useState<AnalysisData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<AnalysisStep | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Clear uploaded images and reset state
  const clearUploadedImages = () => {
    setUploadedImages([]);
    setImages({
      chart4h: null,
      chart1h: null,
      chart15m: null,
      chart5m: null,
    });
    setResults({});
    setError(null);
    setProgress(0);
    setCurrentStep(null);
  };

  // Handle file selection from upload zone
  const handleFilesSelected = (files: File[]) => {
    const newImages = files.map(file => ({ file }));
    setUploadedImages(prev => [...prev, ...newImages]);
    identifyTimeframes([...uploadedImages, ...newImages]);
  };

  // Identify timeframe for each uploaded image
  const identifyTimeframes = async (imagesToProcess: UploadedImage[]) => {
    setDetectingTimeframes(true);
    const timeframeMap: Record<string, keyof ChartImages> = {
      '4h': 'chart4h',
      '4H': 'chart4h',
      '1h': 'chart1h',
      '1H': 'chart1h',
      '15m': 'chart15m',
      '15min': 'chart15m',
      '5m': 'chart5m',
      '5min': 'chart5m',
    };

    const updatedImages = [...imagesToProcess];
    const newChartImages = { ...images };

    for (let i = 0; i < updatedImages.length; i++) {
      if (!updatedImages[i].detectedTimeframe) {
        try {
          const timeframePrompt = `
Analyze this trading chart image and identify the timeframe. Look for timeframe indicators in the chart interface.

Respond with ONLY one of these exact timeframes:
- 4h (for 4 hour charts)
- 1h (for 1 hour charts) 
- 15m (for 15 minute charts)
- 5m (for 5 minute charts)

If you cannot clearly identify the timeframe, respond with "unknown".
`;

          const response = await analyzeChartWithGemini({
            image: updatedImages[i].file,
            prompt: timeframePrompt
          });

          const detectedTimeframe = response.trim().toLowerCase();
          const mappedTimeframe = timeframeMap[detectedTimeframe];

          if (mappedTimeframe) {
            updatedImages[i].detectedTimeframe = mappedTimeframe;
            newChartImages[mappedTimeframe] = updatedImages[i].file;
          } else {
            updatedImages[i].error = `Could not detect timeframe: ${response}`;
          }
        } catch (error) {
          console.error('Error detecting timeframe:', error);
          updatedImages[i].error = 'Failed to detect timeframe';
        }
      }
    }

    setUploadedImages(updatedImages);
    setImages(newChartImages);
    setDetectingTimeframes(false);
  };

  // Main analysis function
  const handleAnalyze = async () => {
    if (!uploadedImages.some(img => img.detectedTimeframe)) {
      setError('Please upload at least one chart with a detected timeframe.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults({});
    setProgress(0);

    const analysisPrompts = {
      chart4h: `
You are an expert trading analyst. Analyze this 4-hour chart and provide detailed technical analysis.

Focus on:
1. **Trend Analysis**: Current trend direction and strength
2. **Support/Resistance**: Key levels and price action around them
3. **Technical Indicators**: RSI, moving averages, volume, any visible indicators
4. **Chart Patterns**: Any recognizable patterns (triangles, flags, head & shoulders, etc.)
5. **Market Structure**: Higher highs/lows, market phases
6. **Risk Assessment**: Potential risks and invalidation levels

Provide your analysis in a structured format with clear sections. Be specific about price levels when visible.
`,
      chart1h: `
You are an expert trading analyst. Analyze this 1-hour chart and provide detailed technical analysis.

Focus on:
1. **Short-term Trend**: Current momentum and direction
2. **Entry/Exit Zones**: Potential trade entry and exit points
3. **Support/Resistance**: Immediate key levels
4. **Technical Indicators**: RSI, moving averages, volume patterns
5. **Price Action**: Recent candlestick patterns and market behavior
6. **Confluence**: Areas where multiple factors align

Provide actionable insights for short-term trading decisions. Be specific about timing and levels.
`,
      chart15m: `
You are an expert trading analyst. Analyze this 15-minute chart for precise entry timing.

Focus on:
1. **Micro Trends**: Very short-term price movements
2. **Entry Timing**: Precise entry signals and confirmations
3. **Scalping Opportunities**: Quick profit-taking levels
4. **Volume Analysis**: Volume spikes and patterns
5. **Price Action**: Recent candle formations and momentum
6. **Risk Management**: Stop-loss placement for short-term trades

Provide specific timing guidance for intraday trading strategies.
`,
      chart5m: `
You are an expert trading analyst. Analyze this 5-minute chart for scalping and precise timing.

Focus on:
1. **Immediate Price Action**: Current momentum and micro-movements
2. **Scalping Setups**: Quick entry/exit opportunities
3. **Volume Confirmation**: Volume supporting price moves
4. **Support/Resistance**: Immediate levels for quick trades
5. **Market Noise**: Filtering out false signals
6. **Execution Timing**: Optimal entry and exit timing

Provide ultra-short-term trading insights with specific timing recommendations.
`
    };

    const timeframes = ['chart4h', 'chart1h', 'chart15m', 'chart5m'] as const;
    const stepNames: Record<typeof timeframes[number], AnalysisStep> = {
      chart4h: '4h',
      chart1h: '1h',
      chart15m: '15min',
      chart5m: '5min'
    };

    const newResults: AnalysisData = {};
    let completedSteps = 0;
    const totalSteps = timeframes.filter(tf => images[tf]).length + 1; // +1 for final analysis

    try {
      // Analyze each timeframe
      for (const timeframe of timeframes) {
        if (images[timeframe]) {
          setCurrentStep(stepNames[timeframe]);
          
          const analysis = await analyzeChartWithGemini({
            image: images[timeframe]!,
            prompt: analysisPrompts[timeframe]
          });

          const resultKey = `analysis${timeframe.replace('chart', '')}` as keyof AnalysisData;
          newResults[resultKey] = analysis;
          setResults(prev => ({ ...prev, [resultKey]: analysis }));
          
          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        }
      }

      // Generate final comprehensive analysis
      setCurrentStep('final');
      
      const availableAnalyses = Object.entries(newResults)
        .filter(([_, analysis]) => analysis)
        .map(([timeframe, analysis]) => `## ${timeframe.replace('analysis', '').toUpperCase()} Analysis:\n${analysis}`)
        .join('\n\n');

      const finalPrompt = `
You are an expert trading analyst. Based on the multi-timeframe analysis provided below, create a comprehensive trading recommendation.

${availableAnalyses}

## Instructions:
Provide a structured final recommendation with these sections:

### Trading Summary
- **Overall Market Bias**: Bullish/Bearish/Neutral with confidence level
- **Recommended Action**: BUY/SELL/WAIT with clear reasoning
- **Trade Type**: Swing/Intraday/Scalp based on the setup quality
- **Confidence Level**: High/Medium/Low

### Reasoning
- **Multi-timeframe Confluence**: How different timeframes align
- **Key Technical Factors**: Most important signals supporting the decision
- **Risk Factors**: What could invalidate this analysis
- **Market Context**: Current market conditions and their impact

### Position Details
- **Entry Zone**: Specific price levels for entry
- **Stop Loss**: Exact stop-loss levels with reasoning
- **Take Profit**: Multiple TP levels with percentages
- **Position Size**: Recommended risk percentage
- **Time Horizon**: Expected trade duration
- **Alternative Scenarios**: What to do if price moves differently

### Waiting Points
- If the recommendation is WAIT, specify:
  - What levels to watch for entry
  - What confirmations to wait for
  - Alternative shorter-term opportunities
  - When to reassess the situation

Be specific with price levels, percentages, and actionable guidance. Focus on practical trading decisions.
`;

      const finalAnalysis = await analyzeChartWithGemini({
        image: images.chart4h || images.chart1h || images.chart15m || images.chart5m!,
        prompt: finalPrompt
      });

      newResults.finalSuggestion = finalAnalysis;
      setResults(prev => ({ ...prev, finalSuggestion: finalAnalysis }));
      
      setProgress(100);
      setCurrentStep(null);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TextSelectionProvider>
      <motion.div 
        className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Header />
      </motion.div>
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          uploadedImages={uploadedImages}
          progress={progress}
          currentStep={currentStep}
          onClearImages={clearUploadedImages}
        />
        
        {/* Main Content */}
        <motion.main 
          className="flex-1 lg:ml-0 p-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Mobile menu button */}
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden pixel-btn mb-4 w-12 h-12 p-0 flex items-center justify-center"
            aria-label="Open sidebar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MenuIcon size={24} />
          </motion.button>

          <div className="max-w-7xl mx-auto space-y-6">
            {/* Upload Section */}
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                className="flex items-center space-x-3 mb-4 border-b-2 border-[var(--accent-blue)] pb-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  className="floating"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ChartIcon size={28} color="var(--accent-blue)" />
                </motion.div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-mono uppercase gradient-text">
                  Chart Analysis
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <UploadZone 
                  onFilesSelected={handleFilesSelected}
                  uploadedImages={uploadedImages}
                  isAnalyzing={loading || detectingTimeframes}
                />
              </motion.div>
              
              {/* Analyze Button */}
              <AnimatePresence>
                {uploadedImages.length > 0 && !loading && (
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ y: 20, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.button
                      onClick={handleAnalyze}
                      className="pixel-btn pixel-btn-primary text-lg px-8 py-4"
                      disabled={!uploadedImages.some(img => img.detectedTimeframe)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(0, 128, 255, 0.3)",
                          "0 0 30px rgba(0, 128, 255, 0.5)",
                          "0 0 20px rgba(0, 128, 255, 0.3)"
                        ]
                      }}
                      transition={{
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      Start Analysis
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Results Section */}
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div 
                className="flex items-center space-x-3 mb-4 border-b-2 border-[var(--accent-green)] pb-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ResultsIcon size={28} color="var(--accent-green)" />
                </motion.div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-mono uppercase gradient-text">
                  Analysis Results
                </h2>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <AnalysisResultsComponent 
                  results={results}
                  loading={loading}
                  error={error}
                  currentStep={currentStep}
                />
              </motion.div>
            </motion.section>
          </div>
        </motion.main>
      </div>
      
      {/* Footer */}
      <motion.footer 
        className="border-t-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm font-mono">
          <motion.div 
            className="text-[var(--text-muted)]"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            Trading Guide v2.0 • Powered by Gemini Vision AI
          </motion.div>
          <motion.div 
            className="text-[var(--text-muted)]"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Always trade responsibly • Not financial advice
          </motion.div>
        </div>
      </motion.footer>
      </motion.div>
      
      {/* Global Contextual Query Components - Rendered at root level */}
      <GlobalContextualQuery />
    </TextSelectionProvider>
  );
}
