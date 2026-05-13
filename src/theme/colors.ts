// src/theme/colors.ts
export const palette = {
  // Brand
  violet: '#7C3AED',
  violetLight: '#A78BFA',
  violetDark: '#5B21B6',
  cyan: '#06B6D4',
  cyanLight: '#67E8F9',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',

  // High Contrast
  hcBackground: '#000000',
  hcSurface: '#1A1A1A',
  hcPrimary: '#FFFF00',
  hcText: '#FFFFFF',
  hcBorder: '#FFFFFF',
};

export type ThemeMode = 'light' | 'dark' | 'highContrast';

export const lightTheme = {
  mode: 'light' as ThemeMode,
  background: palette.gray50,
  surface: palette.white,
  surfaceElevated: palette.white,
  primary: palette.violet,
  primaryLight: palette.violetLight,
  primaryDark: palette.violetDark,
  secondary: palette.cyan,
  accent: palette.emerald,
  warning: palette.amber,
  danger: palette.rose,
  text: palette.gray900,
  textSecondary: palette.gray600,
  textDisabled: palette.gray400,
  textOnPrimary: palette.white,
  border: palette.gray200,
  borderFocus: palette.violet,
  shadow: 'rgba(0,0,0,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
  cardGradientStart: palette.violet,
  cardGradientEnd: palette.cyan,
};

export const darkTheme = {
  mode: 'dark' as ThemeMode,
  background: palette.gray900,
  surface: palette.gray800,
  surfaceElevated: palette.gray700,
  primary: palette.violetLight,
  primaryLight: '#C4B5FD',
  primaryDark: palette.violet,
  secondary: palette.cyanLight,
  accent: '#34D399',
  warning: '#FCD34D',
  danger: '#FB7185',
  text: palette.white,
  textSecondary: palette.gray300,
  textDisabled: palette.gray600,
  textOnPrimary: palette.white,
  border: palette.gray700,
  borderFocus: palette.violetLight,
  shadow: 'rgba(0,0,0,0.4)',
  overlay: 'rgba(0,0,0,0.7)',
  cardGradientStart: palette.violetDark,
  cardGradientEnd: '#0E7490',
};

export const highContrastTheme = {
  mode: 'highContrast' as ThemeMode,
  background: palette.hcBackground,
  surface: palette.hcSurface,
  surfaceElevated: '#2A2A2A',
  primary: palette.hcPrimary,
  primaryLight: '#FFFF99',
  primaryDark: '#CCCC00',
  secondary: '#00FFFF',
  accent: '#00FF00',
  warning: '#FF8800',
  danger: '#FF0000',
  text: palette.hcText,
  textSecondary: '#CCCCCC',
  textDisabled: '#888888',
  textOnPrimary: palette.black,
  border: palette.hcBorder,
  borderFocus: palette.hcPrimary,
  shadow: 'rgba(255,255,255,0.1)',
  overlay: 'rgba(0,0,0,0.85)',
  cardGradientStart: '#111111',
  cardGradientEnd: '#222222',
};

export type Theme = typeof lightTheme;