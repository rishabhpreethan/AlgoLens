'use client';

import React, { useRef, useState } from 'react';
import { UploadIcon, CheckIcon, GuideIcon } from '@/components/icons';

interface UploadedImage {
  file: File;
  detectedTimeframe?: string;
  error?: string;
}

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploadedImages: UploadedImage[];
  isAnalyzing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  uploadedImages,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  const handleClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`pixel-upload-zone ${isDragOver ? 'dragover' : ''} ${
          isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isAnalyzing}
        />
        
        {uploadedImages.length === 0 ? (
          <>
            {/* Upload Icon */}
            <div className="mb-4">
              <UploadIcon size={64} color="var(--accent-blue)" />
            </div>
            
            <h3 className="text-lg font-bold text-[var(--text-primary)] font-mono uppercase mb-2">
              Upload Trading Charts
            </h3>
            <p className="text-[var(--text-secondary)] font-mono text-sm mb-4">
              Drag & drop your chart images here or click to browse
            </p>
            <p className="text-[var(--text-muted)] font-mono text-xs">
              Supported: 4H, 1H, 15M, 5M timeframes • PNG, JPG, WEBP
            </p>
          </>
        ) : (
          <>
            {/* Uploaded Files Preview */}
            <div className="mb-4">
              <CheckIcon size={48} color="var(--accent-green)" />
            </div>
            
            <h3 className="text-lg font-bold text-[var(--accent-green)] font-mono uppercase mb-2">
              {uploadedImages.length} Chart{uploadedImages.length > 1 ? 's' : ''} Uploaded
            </h3>
            <p className="text-[var(--text-secondary)] font-mono text-sm">
              Click to add more charts or proceed with analysis
            </p>
          </>
        )}
      </div>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploadedImages.map((img, index) => (
            <div key={index} className="pixel-card pixel-card-accent">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono truncate">
                    {img.file.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    {(img.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                  {img.detectedTimeframe ? (
                    <>
                      <div className="w-3 h-3 bg-[var(--accent-green)]" />
                      <span className="text-xs text-[var(--accent-green)] font-mono font-bold">
                        {img.detectedTimeframe.replace('chart', '').toUpperCase()}
                      </span>
                    </>
                  ) : img.error ? (
                    <>
                      <div className="w-3 h-3 bg-[var(--accent-red)]" />
                      <span className="text-xs text-[var(--accent-red)] font-mono">
                        ERROR
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-[var(--accent-yellow)]" />
                      <span className="text-xs text-[var(--accent-yellow)] font-mono">
                        DETECTING...
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {img.error && (
                <div className="text-xs text-[var(--accent-red)] font-mono mt-2 p-2 bg-[var(--bg-tertiary)] border border-[var(--accent-red)]">
                  {img.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Instructions */}
      <div className="pixel-card">
        <div className="flex items-center space-x-2 mb-2">
          <GuideIcon size={16} color="var(--accent-blue)" />
          <h4 className="text-sm font-bold text-[var(--text-primary)] font-mono uppercase">
            Upload Guidelines
          </h4>
        </div>
        <ul className="text-xs text-[var(--text-secondary)] font-mono space-y-1">
          <li>• Upload charts for different timeframes (4H, 1H, 15M, 5M)</li>
          <li>• Ensure charts are clear and readable</li>
          <li>• Include price action and volume indicators</li>
          <li>• Maximum 4 charts per analysis session</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadZone;
