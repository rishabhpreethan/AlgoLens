// Modern Pixelated Icons Library
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Sun icon for light theme
export const SunIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="11" y="1" width="2" height="3"/>
    <rect x="11" y="20" width="2" height="3"/>
    <rect x="1" y="11" width="3" height="2"/>
    <rect x="20" y="11" width="3" height="2"/>
    <rect x="4.22" y="4.22" width="1.42" height="1.42"/>
    <rect x="18.36" y="4.22" width="1.42" height="1.42"/>
    <rect x="4.22" y="18.36" width="1.42" height="1.42"/>
    <rect x="18.36" y="18.36" width="1.42" height="1.42"/>
    <rect x="8" y="8" width="8" height="8"/>
    <rect x="6" y="10" width="2" height="4"/>
    <rect x="16" y="10" width="2" height="4"/>
    <rect x="10" y="6" width="4" height="2"/>
    <rect x="10" y="16" width="4" height="2"/>
  </svg>
);

// Moon icon for dark theme
export const MoonIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="6" y="3" width="2" height="2"/>
    <rect x="4" y="5" width="2" height="14"/>
    <rect x="6" y="19" width="2" height="2"/>
    <rect x="8" y="21" width="8" height="2"/>
    <rect x="16" y="19" width="2" height="2"/>
    <rect x="18" y="17" width="2" height="2"/>
    <rect x="20" y="7" width="2" height="10"/>
    <rect x="18" y="5" width="2" height="2"/>
    <rect x="16" y="3" width="2" height="2"/>
    <rect x="8" y="1" width="8" height="2"/>
  </svg>
);

// Settings/Gear icon
export const SettingsIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="10" y="2" width="4" height="4"/>
    <rect x="18" y="6" width="4" height="4"/>
    <rect x="18" y="14" width="4" height="4"/>
    <rect x="10" y="18" width="4" height="4"/>
    <rect x="2" y="14" width="4" height="4"/>
    <rect x="2" y="6" width="4" height="4"/>
    <rect x="8" y="8" width="8" height="8"/>
    <rect x="10" y="10" width="4" height="4"/>
  </svg>
);

// Upload icon
export const UploadIcon: React.FC<IconProps> = ({ size = 64, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill={color} className={className}>
    <rect x="8" y="20" width="48" height="32" fill="none" stroke={color} strokeWidth="3"/>
    <rect x="28" y="12" width="8" height="16"/>
    <rect x="20" y="16" width="8" height="4"/>
    <rect x="36" y="16" width="8" height="4"/>
    <rect x="24" y="28" width="4" height="16"/>
    <rect x="36" y="28" width="4" height="16"/>
    <rect x="20" y="32" width="12" height="4"/>
    <rect x="32" y="32" width="12" height="4"/>
  </svg>
);

// Success/Check icon
export const CheckIcon: React.FC<IconProps> = ({ size = 48, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill={color} className={className}>
    <rect x="6" y="16" width="36" height="24" fill="none" stroke={color} strokeWidth="3"/>
    <rect x="18" y="22" width="3" height="12"/>
    <rect x="27" y="22" width="3" height="12"/>
    <rect x="15" y="25" width="9" height="3"/>
    <rect x="24" y="25" width="9" height="3"/>
    <rect x="21" y="10" width="6" height="12"/>
    <rect x="15" y="13" width="6" height="3"/>
    <rect x="27" y="13" width="6" height="3"/>
  </svg>
);

// Chart/Analytics icon
export const ChartIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="2" y="18" width="4" height="4"/>
    <rect x="6" y="14" width="4" height="8"/>
    <rect x="10" y="10" width="4" height="12"/>
    <rect x="14" y="6" width="4" height="16"/>
    <rect x="18" y="2" width="4" height="20"/>
  </svg>
);

// Results/Document icon
export const ResultsIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="4" y="2" width="16" height="20" fill="none" stroke={color} strokeWidth="2"/>
    <rect x="6" y="6" width="12" height="2"/>
    <rect x="6" y="10" width="12" height="2"/>
    <rect x="6" y="14" width="8" height="2"/>
    <rect x="6" y="18" width="10" height="2"/>
  </svg>
);

// Menu/Hamburger icon
export const MenuIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="3" y="6" width="18" height="2"/>
    <rect x="3" y="11" width="18" height="2"/>
    <rect x="3" y="16" width="18" height="2"/>
  </svg>
);

// Close/X icon
export const CloseIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className}>
    <rect x="2" y="7" width="12" height="2"/>
    <rect x="7" y="2" width="2" height="12"/>
  </svg>
);

// Sample Charts icon
export const SampleIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className}>
    <rect x="1" y="3" width="14" height="10" fill="none" stroke={color} strokeWidth="1"/>
    <rect x="3" y="9" width="2" height="2"/>
    <rect x="6" y="7" width="2" height="4"/>
    <rect x="9" y="5" width="2" height="6"/>
    <rect x="12" y="8" width="2" height="3"/>
  </svg>
);

// Guide/Book icon
export const GuideIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className}>
    <rect x="2" y="2" width="12" height="12" fill="none" stroke={color} strokeWidth="1"/>
    <rect x="4" y="5" width="8" height="1"/>
    <rect x="4" y="7" width="8" height="1"/>
    <rect x="4" y="9" width="6" height="1"/>
    <rect x="4" y="11" width="7" height="1"/>
  </svg>
);

// API/Settings icon
export const ApiIcon: React.FC<IconProps> = ({ size = 16, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} className={className}>
    <rect x="6" y="2" width="4" height="2"/>
    <rect x="12" y="4" width="2" height="2"/>
    <rect x="12" y="10" width="2" height="2"/>
    <rect x="6" y="12" width="4" height="2"/>
    <rect x="2" y="10" width="2" height="2"/>
    <rect x="2" y="4" width="2" height="2"/>
    <rect x="5" y="5" width="6" height="6"/>
    <rect x="7" y="7" width="2" height="2"/>
  </svg>
);

// Empty state icon
export const EmptyIcon: React.FC<IconProps> = ({ size = 64, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill={color} className={className}>
    <rect x="8" y="16" width="48" height="32" fill="none" stroke={color} strokeWidth="3"/>
    <rect x="20" y="24" width="8" height="4"/>
    <rect x="36" y="24" width="8" height="4"/>
    <rect x="24" y="36" width="16" height="4"/>
  </svg>
);

// Loading/Spinner icon
export const LoadingIcon: React.FC<IconProps> = ({ size = 64, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill={color} className={`${className} pixel-loader`}>
    <rect x="28" y="4" width="8" height="8"/>
    <rect x="44" y="12" width="8" height="8"/>
    <rect x="52" y="28" width="8" height="8"/>
    <rect x="44" y="44" width="8" height="8"/>
    <rect x="28" y="52" width="8" height="8"/>
    <rect x="12" y="44" width="8" height="8"/>
    <rect x="4" y="28" width="8" height="8"/>
    <rect x="12" y="12" width="8" height="8"/>
  </svg>
);

// Error/Warning icon
export const ErrorIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="2" y="4" width="20" height="16" fill="none" stroke={color} strokeWidth="2"/>
    <rect x="11" y="8" width="2" height="6"/>
    <rect x="11" y="16" width="2" height="2"/>
  </svg>
);

// Analysis/Brain icon
export const AnalysisIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="6" y="4" width="12" height="16" fill="none" stroke={color} strokeWidth="2"/>
    <rect x="8" y="8" width="8" height="2"/>
    <rect x="8" y="12" width="6" height="2"/>
    <rect x="8" y="16" width="8" height="2"/>
    <rect x="10" y="2" width="4" height="2"/>
  </svg>
);

// Position/Target icon
export const PositionIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="2" y="11" width="20" height="2"/>
    <rect x="11" y="2" width="2" height="20"/>
    <rect x="8" y="8" width="8" height="8" fill="none" stroke={color} strokeWidth="2"/>
    <rect x="10" y="10" width="4" height="4"/>
  </svg>
);

// Question/Help icon
export const QuestionIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="8" y="2" width="8" height="2"/>
    <rect x="6" y="4" width="2" height="2"/>
    <rect x="16" y="4" width="2" height="2"/>
    <rect x="4" y="6" width="2" height="4"/>
    <rect x="18" y="6" width="2" height="4"/>
    <rect x="6" y="10" width="2" height="2"/>
    <rect x="16" y="10" width="2" height="2"/>
    <rect x="8" y="12" width="8" height="2"/>
    <rect x="10" y="14" width="4" height="2"/>
    <rect x="10" y="18" width="4" height="2"/>
  </svg>
);

// Send/Arrow icon
export const SendIcon: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
    <rect x="2" y="10" width="2" height="4"/>
    <rect x="4" y="8" width="2" height="2"/>
    <rect x="4" y="14" width="2" height="2"/>
    <rect x="6" y="6" width="2" height="2"/>
    <rect x="6" y="16" width="2" height="2"/>
    <rect x="8" y="4" width="2" height="2"/>
    <rect x="8" y="18" width="2" height="2"/>
    <rect x="10" y="2" width="2" height="2"/>
    <rect x="10" y="20" width="2" height="2"/>
    <rect x="12" y="2" width="10" height="2"/>
    <rect x="20" y="4" width="2" height="16"/>
    <rect x="12" y="20" width="10" height="2"/>
  </svg>
);
