'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TextSelectionState {
  selectedText: string;
  fullContext: string;
  showQueryBar: boolean;
  showChatSidebar: boolean;
  initialQuestion: string;
}

interface TextSelectionContextType {
  state: TextSelectionState;
  setSelectedText: (text: string, context: string) => void;
  showQueryBar: () => void;
  hideQueryBar: () => void;
  showChatSidebar: (question: string) => void;
  hideChatSidebar: () => void;
  clearSelection: () => void;
}

const TextSelectionContext = createContext<TextSelectionContextType | undefined>(undefined);

export const useTextSelection = () => {
  const context = useContext(TextSelectionContext);
  if (!context) {
    throw new Error('useTextSelection must be used within a TextSelectionProvider');
  }
  return context;
};

interface TextSelectionProviderProps {
  children: ReactNode;
}

export const TextSelectionProvider: React.FC<TextSelectionProviderProps> = ({ children }) => {
  const [state, setState] = useState<TextSelectionState>({
    selectedText: '',
    fullContext: '',
    showQueryBar: false,
    showChatSidebar: false,
    initialQuestion: ''
  });

  const setSelectedText = (text: string, context: string) => {
    setState(prev => ({
      ...prev,
      selectedText: text,
      fullContext: context
    }));
  };

  const showQueryBar = () => {
    setState(prev => ({
      ...prev,
      showQueryBar: true
    }));
  };

  const hideQueryBar = () => {
    setState(prev => ({
      ...prev,
      showQueryBar: false
    }));
  };

  const showChatSidebar = (question: string) => {
    setState(prev => ({
      ...prev,
      showQueryBar: false,
      showChatSidebar: true,
      initialQuestion: question
    }));
  };

  const hideChatSidebar = () => {
    setState(prev => ({
      ...prev,
      showChatSidebar: false,
      initialQuestion: ''
    }));
  };

  const clearSelection = () => {
    setState({
      selectedText: '',
      fullContext: '',
      showQueryBar: false,
      showChatSidebar: false,
      initialQuestion: ''
    });

    // Clear the browser text selection
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };

  const contextValue: TextSelectionContextType = {
    state,
    setSelectedText,
    showQueryBar,
    hideQueryBar,
    showChatSidebar,
    hideChatSidebar,
    clearSelection
  };

  return (
    <TextSelectionContext.Provider value={contextValue}>
      {children}
    </TextSelectionContext.Provider>
  );
};
