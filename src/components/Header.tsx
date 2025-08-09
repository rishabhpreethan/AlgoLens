'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, SettingsIcon, ChartIcon } from '@/components/icons';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-[var(--bg-secondary)] border-b-2 border-[var(--border-primary)] flex items-center justify-between px-6">
      {/* Logo and Title */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[var(--accent-blue)] border-2 border-[var(--text-primary)] flex items-center justify-center">
          <ChartIcon size={20} color="var(--text-primary)" />
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">
          Trading Guide v2
        </h1>
      </div>

      {/* Navigation and Controls */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="pixel-btn w-12 h-12 p-0 flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? (
            <SunIcon size={20} />
          ) : (
            <MoonIcon size={20} />
          )}
        </button>

        {/* Settings Button */}
        <button className="pixel-btn w-12 h-12 p-0 flex items-center justify-center transition-all duration-200 hover:scale-105" aria-label="Settings">
          <SettingsIcon size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
