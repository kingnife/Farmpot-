/**
 * FarmPot Centralized Design Token System
 * 
 * Visual source of truth for the FarmPot Agricultural Platform.
 * Deep Green + Light Green + Warm Off-White Canvas + White Cards + Dark Neutral Text
 */

export const FARMPOT_THEME = {
  colors: {
    // 1. Primary Brand Green - Main action & brand anchor
    primary: '#334E1B',
    primaryHover: '#3F6B24',

    // 2. Secondary Green - Supporting buttons & visual elements
    secondary: '#3F6B24',
    secondaryHover: '#334E1B',

    // 3. Light Green - Soft backgrounds & selected / positive states
    lightGreen: '#EDFFE0',

    // 4. Main Application Canvas Background - Warm neutral off-white
    background: '#EAEAE2',

    // 5. White Content Surfaces - Cards, tables, forms, modals
    surface: '#FFFFFF',

    // 6. Text
    textPrimary: '#1F1F1F',
    textSecondary: '#777777',

    // Neutral Borders
    border: '#D8D8CF',
    borderLight: '#E8E8DF',

    // 7. Status Colors
    status: {
      success: '#334E1B',
      successBg: '#EDFFE0',
      successBorder: '#BEE7A5',
      warning: '#B45309',
      warningBg: '#FEF3C7',
      warningBorder: '#FDE68A',
      error: '#DC2626',
      errorBg: '#FEE2E2',
      errorBorder: '#FECACA',
      neutral: '#4B5563',
      neutralBg: '#F3F4F6',
      neutralBorder: '#E5E7EB',
    },
  },
} as const;

export type FarmPotTheme = typeof FARMPOT_THEME;
