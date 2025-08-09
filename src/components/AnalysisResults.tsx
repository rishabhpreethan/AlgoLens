'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ErrorIcon, LoadingIcon, EmptyIcon, ChartIcon, AnalysisIcon, PositionIcon } from '@/components/icons';
import SelectableText from '@/components/SelectableText';

interface AnalysisResults {
  analysis4h?: string;
  analysis1h?: string;
  analysis15m?: string;
  analysis5m?: string;
  finalSuggestion?: string;
}

interface AnalysisResultsProps {
  results: AnalysisResults;
  loading: boolean;
  error: string | null;
  currentStep: string | null;
}

type TabType = 'overall' | '4h' | '1h' | '15min' | '5min';

// Custom components for markdown rendering with pixelated styling
const markdownComponents = {
  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full pixel-card" {...props} />
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-[var(--bg-tertiary)]" {...props}>
      {props.children}
    </thead>
  ),
  th: ({ node, isHeader, ...props }: any) => (
    <th 
      className="px-4 py-2 text-left text-sm font-bold text-[var(--text-primary)] font-mono uppercase border-b-2 border-[var(--border-primary)]"
      {...props}
    >
      {props.children}
    </th>
  ),
  tbody: ({ node, ...props }: any) => (
    <tbody className="bg-[var(--bg-secondary)]" {...props}>
      {props.children}
    </tbody>
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)]" {...props}>
      {props.children}
    </tr>
  ),
  td: ({ node, ...props }: any) => (
    <td 
      className="px-4 py-2 text-sm text-[var(--text-primary)] font-mono" 
      {...props}
    >
      {props.children}
    </td>
  ),
  h1: ({ node, ...props }: any) => (
    <h1 className="text-2xl font-bold text-[var(--accent-blue)] font-mono uppercase mb-4 border-b-2 border-[var(--accent-blue)] pb-2" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl font-bold text-[var(--accent-blue)] font-mono uppercase mb-3 border-b border-[var(--accent-blue)] pb-1" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase mb-2" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="text-[var(--text-primary)] font-mono mb-3 leading-relaxed" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-none space-y-1 mb-3" {...props} />
  ),
  li: ({ node, ...props }: any) => (
    <li className="text-[var(--text-primary)] font-mono flex items-start" {...props}>
      <span className="text-[var(--accent-blue)] mr-2">▶</span>
      <span>{props.children}</span>
    </li>
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="text-[var(--accent-yellow)] font-bold" {...props} />
  ),
  em: ({ node, ...props }: any) => (
    <em className="text-[var(--accent-green)] font-mono" {...props} />
  ),
  code: ({ node, inline, ...props }: any) => (
    inline ? (
      <code className="bg-[var(--bg-tertiary)] text-[var(--accent-blue)] px-1 py-0.5 font-mono text-sm border border-[var(--border-primary)]" {...props} />
    ) : (
      <code className="block bg-[var(--bg-tertiary)] text-[var(--text-primary)] p-3 font-mono text-sm border-2 border-[var(--border-primary)] overflow-x-auto" {...props} />
    )
  ),
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  results,
  loading,
  error,
  currentStep
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overall');

  const tabs = [
    { id: 'overall' as TabType, label: 'Overall', hasContent: !!results.finalSuggestion },
    { id: '4h' as TabType, label: '4H', hasContent: !!results.analysis4h },
    { id: '1h' as TabType, label: '1H', hasContent: !!results.analysis1h },
    { id: '15min' as TabType, label: '15M', hasContent: !!results.analysis15m },
    { id: '5min' as TabType, label: '5M', hasContent: !!results.analysis5m },
  ];

  const parseOverallAnalysis = (finalSuggestion: string) => {
    const sections = {
      summary: '',
      reasoning: '',
      positionDetails: ''
    };

    // Extract summary (everything before "## Reasoning" or "**Reasoning")
    const reasoningMatch = finalSuggestion.match(/(## Reasoning|##\s*Reasoning|\*\*Reasoning)/i);
    if (reasoningMatch) {
      sections.summary = finalSuggestion.substring(0, reasoningMatch.index).trim();
      
      // Extract reasoning section
      const reasoningStart = reasoningMatch.index! + reasoningMatch[0].length;
      const positionMatch = finalSuggestion.match(/(## Position Details|##\s*Position Details|\*\*Position Details)/i);
      
      if (positionMatch) {
        sections.reasoning = finalSuggestion.substring(reasoningStart, positionMatch.index).trim();
        sections.positionDetails = finalSuggestion.substring(positionMatch.index! + positionMatch[0].length).trim();
      } else {
        sections.reasoning = finalSuggestion.substring(reasoningStart).trim();
      }
    } else {
      sections.summary = finalSuggestion;
    }

    return sections;
  };

  if (error) {
    return (
      <div className="pixel-card pixel-card-danger">
        <div className="flex items-center space-x-2 mb-3">
          <ErrorIcon size={20} color="var(--accent-red)" />
          <h3 className="text-lg font-bold text-[var(--accent-red)] font-mono uppercase">
            Analysis Error
          </h3>
        </div>
        <p className="text-[var(--text-primary)] font-mono">
          {error}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pixel-card text-center py-12">
        <div className="flex justify-center mb-4">
          <LoadingIcon size={64} color="var(--accent-blue)" />
        </div>
        <h3 className="text-lg font-bold text-[var(--accent-blue)] font-mono uppercase mb-2">
          Analyzing Charts...
        </h3>
        {currentStep && (
          <p className="text-[var(--text-secondary)] font-mono">
            Current Step: {currentStep.toUpperCase()}
          </p>
        )}
        <p className="text-xs text-[var(--text-muted)] font-mono mt-2">
          This may take a moment
        </p>
      </div>
    );
  }

  const hasAnyResults = Object.values(results).some(result => !!result);

  if (!hasAnyResults) {
    return (
      <div className="pixel-card text-center py-12">
        <div className="mb-4">
          <EmptyIcon size={64} color="var(--text-muted)" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-muted)] font-mono uppercase mb-2">
          No Analysis Yet
        </h3>
        <p className="text-[var(--text-secondary)] font-mono">
          Upload your trading charts to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="pixel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pixel-tab ${activeTab === tab.id ? 'active' : ''} ${
              !tab.hasContent ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!tab.hasContent}
          >
            {tab.label}
            {tab.hasContent && (
              <span className="ml-2 w-2 h-2 bg-[var(--accent-green)] inline-block"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overall Analysis */}
        {activeTab === 'overall' && results.finalSuggestion && (
          <div className="space-y-4">
            {(() => {
              const sections = parseOverallAnalysis(results.finalSuggestion);
              
              return (
                <>
                  {/* Summary Section */}
                  {sections.summary && (
                    <div className="pixel-card pixel-card-accent">
                      <div className="flex items-center space-x-2 mb-3">
                        <ChartIcon size={20} color="var(--accent-blue)" />
                        <h4 className="text-lg font-bold text-[var(--accent-blue)] font-mono uppercase">
                          Trading Summary
                        </h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <SelectableText fullContext={results.finalSuggestion || ''}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {sections.summary}
                          </ReactMarkdown>
                        </SelectableText>
                      </div>
                    </div>
                  )}
                  
                  {/* Reasoning Section */}
                  {sections.reasoning && (
                    <div className="pixel-card">
                      <div className="flex items-center space-x-2 mb-3">
                        <AnalysisIcon size={20} color="var(--accent-yellow)" />
                        <h4 className="text-lg font-bold text-[var(--accent-yellow)] font-mono uppercase">
                          Analysis Reasoning
                        </h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <SelectableText fullContext={results.finalSuggestion || ''}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {sections.reasoning}
                          </ReactMarkdown>
                        </SelectableText>
                      </div>
                    </div>
                  )}
                  
                  {/* Position Details Section */}
                  {sections.positionDetails && (
                    <div className="pixel-card pixel-card-success">
                      <div className="flex items-center space-x-2 mb-3">
                        <PositionIcon size={20} color="var(--accent-green)" />
                        <h4 className="text-lg font-bold text-[var(--accent-green)] font-mono uppercase">
                          Position Details
                        </h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <SelectableText fullContext={results.finalSuggestion || ''}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {sections.positionDetails}
                          </ReactMarkdown>
                        </SelectableText>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
        
        {/* Individual Timeframe Analysis */}
        {activeTab === '4h' && results.analysis4h && (
          <div className="pixel-card">
            <div className="flex items-center space-x-2 mb-3">
              <ChartIcon size={20} color="var(--accent-blue)" />
              <h4 className="text-lg font-bold text-[var(--accent-blue)] font-mono uppercase">4H Timeframe Analysis</h4>
            </div>
            <div className="prose prose-sm max-w-none">
              <SelectableText fullContext={`4H Analysis: ${results.analysis4h || ''}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {results.analysis4h}
                </ReactMarkdown>
              </SelectableText>
            </div>
          </div>
        )}
        
        {activeTab === '1h' && results.analysis1h && (
          <div className="pixel-card">
            <div className="flex items-center space-x-2 mb-3">
              <ChartIcon size={20} color="var(--accent-blue)" />
              <h4 className="text-lg font-bold text-[var(--accent-blue)] font-mono uppercase">1H Timeframe Analysis</h4>
            </div>
            <div className="prose prose-sm max-w-none">
              <SelectableText fullContext={`1H Analysis: ${results.analysis1h || ''}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {results.analysis1h}
                </ReactMarkdown>
              </SelectableText>
            </div>
          </div>
        )}
        
        {activeTab === '15min' && results.analysis15m && (
          <div className="pixel-card">
            <div className="flex items-center space-x-2 mb-3">
              <ChartIcon size={20} color="var(--accent-blue)" />
              <h4 className="text-lg font-bold text-[var(--accent-blue)] font-mono uppercase">15M Timeframe Analysis</h4>
            </div>
            <div className="prose prose-sm max-w-none">
              <SelectableText fullContext={`15M Analysis: ${results.analysis15m || ''}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {results.analysis15m}
                </ReactMarkdown>
              </SelectableText>
            </div>
          </div>
        )}
        
        {activeTab === '5min' && results.analysis5m && (
          <div className="pixel-card">
            <div className="flex items-center space-x-2 mb-3">
              <ChartIcon size={20} color="var(--accent-blue)" />
              <h4 className="text-lg font-bold text-[var(--accent-blue)] font-mono uppercase">5M Timeframe Analysis</h4>
            </div>
            <div className="prose prose-sm max-w-none">
              <SelectableText fullContext={`5M Analysis: ${results.analysis5m || ''}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {results.analysis5m}
                </ReactMarkdown>
              </SelectableText>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
