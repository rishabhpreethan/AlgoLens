'use client';

import React, { useRef, useEffect } from 'react';
import { useTextSelection } from '@/contexts/TextSelectionContext';

interface SelectableTextProps {
  children: React.ReactNode;
  fullContext: string;
  className?: string;
}

export default function SelectableText({ children, fullContext, className = '' }: SelectableTextProps) {
  const { state, setSelectedText, showQueryBar, hideQueryBar, clearSelection } = useTextSelection();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let selectionTimeout: NodeJS.Timeout;

    const handleSelection = () => {
      // Clear any existing timeout
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }

      // Add a small delay to prevent flickering
      selectionTimeout = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const selectedContent = selection.toString().trim();
        if (!selectedContent) {
          // Only hide if we're not already showing the query bar
          if (!state.showQueryBar) {
            hideQueryBar();
            clearSelection();
          }
          return;
        }

        // Check if the selection is within our container
        const range = selection.getRangeAt(0);
        const container = containerRef.current;
        if (!container || !container.contains(range.commonAncestorContainer)) {
          return;
        }

        // Only update if the selected text has changed
        if (selectedContent !== state.selectedText) {
          setSelectedText(selectedContent, fullContext);
          showQueryBar();
        }
      }, 100); // 100ms delay to prevent flickering
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking on the query bar or chat sidebar
      if (target.closest('.bottom-query-bar') || target.closest('.chat-sidebar')) {
        return;
      }

      // Check if we still have a selection after a short delay
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().trim() === '') {
          hideQueryBar();
          clearSelection();
        }
      }, 50);
    };

    // Add event listeners
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('click', handleClickOutside);

    return () => {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [state.selectedText, state.showQueryBar, fullContext, setSelectedText, showQueryBar, hideQueryBar, clearSelection]);

  // No need for local handlers since we're using global context

  return (
    <div
      ref={containerRef}
      className={`selectable-content ${className}`}
      style={{
        userSelect: 'text',
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        msUserSelect: 'text'
      }}
    >
      {children}
    </div>
  );
}
