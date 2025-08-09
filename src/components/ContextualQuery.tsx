'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeWithContext } from '@/lib/geminiApi';
import { QuestionIcon, SendIcon, CloseIcon, LoadingIcon } from '@/components/icons';

interface ContextualQueryProps {
  selectedText: string;
  fullContext: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function ContextualQuery({ 
  selectedText, 
  fullContext, 
  position, 
  onClose 
}: ContextualQueryProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Handle clicks outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await analyzeWithContext({
        question: question.trim(),
        selectedText,
        fullContext
      });
      setAnswer(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed z-50 bg-[var(--bg-secondary)] border-2 border-[var(--accent-blue)] rounded-lg shadow-2xl max-w-md w-full"
        style={{
          left: Math.min(position.x, window.innerWidth - 400),
          top: Math.min(position.y, window.innerHeight - 300),
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.2 }}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center space-x-2">
            <QuestionIcon size={20} color="var(--accent-blue)" />
            <h3 className="font-mono font-bold text-sm uppercase text-[var(--text-primary)]">
              Ask About Selection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
            aria-label="Close"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Selected Text Preview */}
        <div className="p-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
          <p className="text-xs font-mono text-[var(--text-muted)] mb-1">SELECTED TEXT:</p>
          <p className="text-sm text-[var(--text-secondary)] italic line-clamp-3">
            "{selectedText}"
          </p>
        </div>

        {/* Question Input */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this selection..."
              className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={!question.trim() || loading}
              className="px-4 py-2 bg-[var(--accent-blue)] text-[var(--bg-primary)] rounded font-mono text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? <LoadingIcon size={16} /> : <SendIcon size={16} />}
            </motion.button>
          </div>
        </form>

        {/* Answer Display */}
        <AnimatePresence>
          {(loading || answer || error) && (
            <motion.div
              className="border-t border-[var(--border-primary)] p-4 max-h-64 overflow-y-auto"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <div className="pixel-loader"></div>
                  <span className="ml-3 text-sm font-mono text-[var(--text-muted)]">
                    Analyzing...
                  </span>
                </div>
              )}

              {error && (
                <div className="text-[var(--accent-red)] text-sm font-mono bg-[var(--bg-primary)] p-3 rounded border border-[var(--accent-red)]">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {answer && (
                <motion.div
                  className="text-sm text-[var(--text-primary)] font-mono leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 text-xs text-[var(--text-muted)] uppercase font-bold">
                    Gemini's Answer:
                  </div>
                  <div className="whitespace-pre-wrap">{answer}</div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
