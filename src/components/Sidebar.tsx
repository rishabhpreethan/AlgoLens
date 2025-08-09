'use client';

import React from 'react';
import { CloseIcon, SampleIcon, GuideIcon, ApiIcon } from '@/components/icons';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  uploadedImages: any[];
  progress: number;
  currentStep: string | null;
  onClearImages: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  uploadedImages,
  progress,
  currentStep,
  onClearImages
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[var(--bg-secondary)] 
        border-r-2 border-[var(--border-primary)] transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b-2 border-[var(--border-primary)] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase">
            Analysis Panel
          </h2>
          <button
            onClick={onToggle}
            className="lg:hidden pixel-btn w-8 h-8 p-0 flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-b-2 border-[var(--border-primary)]">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] font-mono uppercase mb-3">
            Chart Upload
          </h3>
          
          {uploadedImages.length > 0 && (
            <div className="space-y-2 mb-4">
              {uploadedImages.map((img, index) => (
                <div key={index} className="pixel-card p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-primary)] font-mono truncate">
                      {img.file.name}
                    </span>
                    <div className={`w-3 h-3 ${
                      img.detectedTimeframe ? 'bg-[var(--accent-green)]' : 'bg-[var(--accent-yellow)]'
                    }`} />
                  </div>
                  {img.detectedTimeframe && (
                    <div className="text-xs text-[var(--accent-blue)] font-mono mt-1">
                      {img.detectedTimeframe.replace('chart', '').toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={onClearImages}
                className="pixel-btn pixel-btn-danger w-full text-xs"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Progress Section */}
        {(progress > 0 || currentStep) && (
          <div className="p-4 border-b-2 border-[var(--border-primary)]">
            <h3 className="text-sm font-bold text-[var(--text-secondary)] font-mono uppercase mb-3">
              Analysis Progress
            </h3>
            
            <div className="pixel-progress mb-3">
              <div 
                className="pixel-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {currentStep && (
              <div className="text-xs text-[var(--accent-blue)] font-mono">
                Current: {currentStep.toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 border-b-2 border-[var(--border-primary)]">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] font-mono uppercase mb-3">
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button className="pixel-btn w-full text-xs flex items-center justify-center space-x-2">
              <SampleIcon size={14} />
              <span>Sample Charts</span>
            </button>
            <button className="pixel-btn w-full text-xs flex items-center justify-center space-x-2">
              <GuideIcon size={14} />
              <span>User Guide</span>
            </button>
            <button className="pixel-btn w-full text-xs flex items-center justify-center space-x-2">
              <ApiIcon size={14} />
              <span>API Settings</span>
            </button>
          </div>
        </div>

        {/* Analysis History */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] font-mono uppercase mb-3">
            Recent Analysis
          </h3>
          
          <div className="space-y-2">
            <div className="pixel-card p-2 cursor-pointer hover:bg-[var(--bg-tertiary)]">
              <div className="text-xs text-[var(--text-primary)] font-mono">
                BTC/USD Analysis
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono">
                2 hours ago
              </div>
            </div>
            <div className="pixel-card p-2 cursor-pointer hover:bg-[var(--bg-tertiary)]">
              <div className="text-xs text-[var(--text-primary)] font-mono">
                ETH/USD Analysis
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono">
                1 day ago
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[var(--border-primary)]">
          <div className="text-xs text-[var(--text-muted)] font-mono text-center">
            Trading Guide v2.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
