'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionIcon, SendIcon, CloseIcon } from '@/components/icons';

interface BottomQueryBarProps {
  selectedText: string;
  isVisible: boolean;
  onSubmit: (question: string) => void;
  onClose: () => void;
}

export default function BottomQueryBar({ 
  selectedText, 
  isVisible, 
  onSubmit, 
  onClose 
}: BottomQueryBarProps) {
  const [question, setQuestion] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      // Focus the input when the bar appears
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    onSubmit(question.trim());
    setQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Query Bar */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bottom-query-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            <div className="w-full max-w-2xl mx-auto px-4 pb-4">
            <div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent-blue)] rounded-xl shadow-2xl backdrop-filter backdrop-blur-20 contextual-query-popup">
              {/* Header with selected text preview */}
              <div className="px-4 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)] rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <QuestionIcon size={18} color="var(--accent-blue)" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-[var(--text-muted)] mb-1">SELECTED TEXT:</p>
                      <p className="text-sm text-[var(--text-secondary)] italic truncate">
                        "{selectedText}"
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-[var(--bg-primary)] rounded transition-colors ml-2 flex-shrink-0"
                    aria-label="Close"
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-4">
                <div className="flex space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this selection..."
                    className="flex-1 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-opacity-20 transition-all"
                    onKeyDown={handleKeyDown}
                  />
                  <motion.button
                    type="submit"
                    disabled={!question.trim()}
                    className="px-6 py-3 bg-[var(--accent-blue)] text-[var(--bg-primary)] rounded-lg font-mono text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SendIcon size={16} />
                    <span>Ask</span>
                  </motion.button>
                </div>
                
                {/* Hint text */}
                <p className="text-xs text-[var(--text-muted)] mt-2 text-center font-mono">
                  Press Enter to ask • Escape to close
                </p>
              </form>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
