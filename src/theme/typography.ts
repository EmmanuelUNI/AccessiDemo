// src/theme/typography.ts
export type FontScale = 'small' | 'normal' | 'large' | 'xlarge';

export const fontScaleMultipliers: Record<FontScale, number> = {
  small: 0.85,
  normal: 1.0,
  large: 1.25,
  xlarge: 1.5,
};

export const baseTypography = {
  // Font families (loaded via expo-font)
  fontFamily: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semibold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
  },
  // Base sizes
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

export const getScaledFontSize = (
  baseSize: number,
  scale: FontScale
): number => {
  return Math.round(baseSize * fontScaleMultipliers[scale]);
};

// src/theme/spacing.ts
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

// Touch target minimum (WCAG 2.5.5: 44x44pt)
export const MIN_TOUCH_TARGET = 44;
export const ACCESSIBLE_TOUCH_TARGET = 56;