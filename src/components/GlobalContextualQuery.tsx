'use client';

import React from 'react';
import { useTextSelection } from '@/contexts/TextSelectionContext';
import BottomQueryBar from './BottomQueryBar';
import ChatSidebar from './ChatSidebar';

export default function GlobalContextualQuery() {
  const { state, hideQueryBar, showChatSidebar, hideChatSidebar, clearSelection } = useTextSelection();

  const handleSubmitQuestion = (question: string) => {
    showChatSidebar(question);
  };

  const handleCloseQueryBar = () => {
    hideQueryBar();
    clearSelection();
  };

  const handleCloseChatSidebar = () => {
    hideChatSidebar();
    clearSelection();
  };

  return (
    <>
      {/* Bottom Query Bar - Appears at bottom of entire screen */}
      <BottomQueryBar
        selectedText={state.selectedText}
        isVisible={state.showQueryBar}
        onSubmit={handleSubmitQuestion}
        onClose={handleCloseQueryBar}
      />

      {/* Chat Sidebar - Covers entire screen height */}
      <ChatSidebar
        isOpen={state.showChatSidebar}
        initialQuestion={state.initialQuestion}
        selectedText={state.selectedText}
        fullContext={state.fullContext}
        onClose={handleCloseChatSidebar}
      />
    </>
  );
}
