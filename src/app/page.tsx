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
This is a TradingView chart screenshot. Identify the currently selected timeframe.

In TradingView, the selected timeframe appears as a highlighted button in the top toolbar.
It will be one of these options: 4h, 1h, 15m, or 5m (may appear as 5).

The selected timeframe button typically:
- Has a different background color than other timeframe buttons
- May be darker or lighter than surrounding buttons
- May have a border or glow effect
- Is positioned in the timeframe selector area of the toolbar

Pay special attention to the 5m timeframe, which may appear simply as '5' in the interface.

Respond with ONLY one of these exact timeframes:
- 4h (for 4 hour charts)
- 1h (for 1 hour charts) 
- 15m (for 15 minute charts)
- 5m (for 5 minute charts)

If you cannot clearly identify the selected timeframe, respond with "unknown".
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
You are an expert trading analyst. Analyze this 4-hour chart and extract structured insights for multi-style trading.

Focus on:
1. Trend Analysis: Direction/strength, market structure (HH/HL or LH/LL)
2. Support/Resistance: Key zones with exact price levels when visible
3. AutoFib Retracement: Identify swing high/low and list 0.382, 0.5, 0.618, 0.786 levels with prices
4. RSI: Current value, overbought/oversold status, divergences (bullish/bearish), trend of RSI
5. Patterns: Triangles, flags, H&S, double tops/bottoms, breakouts/breakdowns
6. Confluence: Where Fib, RSI, S/R, and patterns align
7. Risk/Invalidation: Clear invalidation levels

Output format (use concise bullet points, no long paragraphs):
- Trend: ...
- Key Levels: [level -> price]
- Fib Levels: [0.382: x], [0.5: y], [0.618: z], [0.786: a]
- RSI: value, state, divergences
- Patterns: ...
- Notes: ...
`,
      chart1h: `
You are an expert trading analyst. Analyze this 1-hour chart with emphasis on actionable levels and confluence.

Focus on:
1. Short-term trend and momentum
2. Entry/Exit zones with exact prices
3. AutoFib: 0.382/0.5/0.618/0.786 from the most recent significant swing
4. RSI: value, overbought/oversold, divergences, MA cross if visible
5. Confluence and risk

Output (bullets only): Trend, Key Levels, Fib Levels, RSI, Patterns, Notes.
`,
      chart15m: `
Analyze this 15-minute chart for intraday timing and precise levels.

Focus on:
1. Micro-trends and momentum shifts
2. Pullback/Breakout entries relative to Fib levels
3. RSI: value, thresholds, divergences for timing
4. Immediate S/R levels and liquidity zones
5. Execution and risk

Output (bullets only): Trend, Key Levels, Fib Levels, RSI, Patterns, Notes.
`,
      chart5m: `
Analyze this 5-minute chart for scalping and micro-structure.

Focus on:
1. Immediate price action and momentum
2. Quick setups: micro pullbacks to Fib/MA, range breaks, VWAP (if visible)
3. RSI timing cues and divergences
4. Very near S/R levels
5. Execution timing

Output (bullets only): Trend, Key Levels, Fib Levels, RSI, Patterns, Notes.
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
You are an expert trading analyst. Using the multi-timeframe analyses below, produce a structured plan that considers Swing, Day Trade, Intraday, and Scalping opportunities.

${availableAnalyses}

## Output Requirements (concise bullets, no long paragraphs)

### Trade Opportunities by Type
For each type — Swing, Day Trade, Intraday, Scalping — do:
- Setup Summary: Direction (BUY/SELL), rationale (confluence of Fib/RSI/SR/Patterns)
- Entry: exact level(s) or zone
- Stop: invalidation level
- Take Profit: TP1/TP2/TP3 with prices and %
- Confidence: 0–100 numeric score
- Conditions: what must be true (e.g., RSI cross > 50, bullish divergence, break/retest of level)

### If No Trade in a Type
Provide a WAIT plan for that type:
- Watch Levels: explicit prices (prefer Fib 0.382/0.5/0.618/0.786 and key SR)
- Confirmations: RSI thresholds/divergence, candle patterns, break-and-retest
- Invalidations: what cancels the idea
- Reassess: when to check again (time or level)

### Global Summary
- Overall Bias: Bullish/Bearish/Neutral with 0–100 confidence
- Best Opportunity: which type currently offers the best R:R and why
- Risk Notes: key invalidations and news/volatility considerations

Rules:
- Prefer AutoFib and RSI as primary signals; include pattern-based confluence when visible
- List levels as bullets with prices; avoid long paragraphs
- If any timeframe is missing, still produce plans using available data
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
