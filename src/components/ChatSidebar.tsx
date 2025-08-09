'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeWithContext } from '@/lib/geminiApi';
import { QuestionIcon, SendIcon, CloseIcon, LoadingIcon, ErrorIcon } from '@/components/icons';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  selectedText?: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  initialQuestion: string;
  selectedText: string;
  fullContext: string;
  onClose: () => void;
}

export default function ChatSidebar({ 
  isOpen, 
  initialQuestion, 
  selectedText, 
  fullContext, 
  onClose 
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle initial question when sidebar opens
  useEffect(() => {
    if (isOpen && initialQuestion && messages.length === 0) {
      handleSubmitQuestion(initialQuestion, true);
    }
  }, [isOpen, initialQuestion]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmitQuestion = async (question: string, isInitial = false) => {
    if (!question.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
      selectedText: isInitial ? selectedText : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await analyzeWithContext({
        question: question.trim(),
        selectedText,
        fullContext
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitQuestion(currentQuestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Chat Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full lg:w-96 bg-[var(--bg-secondary)] border-l-2 border-[var(--accent-blue)] z-50 flex flex-col shadow-2xl chat-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.4 
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
              <div className="flex items-center space-x-2">
                <QuestionIcon size={20} color="var(--accent-blue)" />
                <h3 className="font-mono font-bold text-sm uppercase text-[var(--text-primary)]">
                  Contextual Chat
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-primary)] rounded transition-colors"
                aria-label="Close chat"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Selected Text Context */}
            <div className="p-3 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
              <p className="text-xs font-mono text-[var(--text-muted)] mb-1">DISCUSSING:</p>
              <p className="text-sm text-[var(--text-secondary)] italic line-clamp-3">
                "{selectedText}"
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
                      message.type === 'user'
                        ? 'bg-[var(--accent-blue)] text-[var(--bg-primary)] rounded-br-none'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-bl-none'
                    }`}
                  >
                    {message.selectedText && (
                      <div className="mb-2 p-2 bg-black bg-opacity-20 rounded text-xs italic">
                        Re: "{message.selectedText.substring(0, 50)}..."
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] p-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                    <div className="pixel-loader w-4 h-4"></div>
                    <span className="text-sm font-mono text-[var(--text-muted)]">
                      Analyzing...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                  disabled={loading}
                  onKeyDown={handleKeyDown}
                />
                <motion.button
                  type="submit"
                  disabled={!currentQuestion.trim() || loading}
                  className="px-4 py-2 bg-[var(--accent-blue)] text-[var(--bg-primary)] rounded font-mono text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? <LoadingIcon size={16} /> : <SendIcon size={16} />}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
