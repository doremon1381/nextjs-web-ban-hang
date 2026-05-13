/**
 * Design Tokens - Nhãn Việt
 * Type-safe design tokens để sử dụng trong Next.js
 */

export const colors = {
  // Brand Colors
  brand: {
    greenPrimary: '#43A047',
    greenLight: '#DFF5E1',
    greenDark: '#1F5E3B',
    longanYellow: '#F4B942',
    cream: '#FFF8E7',
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray200: '#E5E7EB',
    gray500: '#6B7280',
    gray800: '#1F2937',
  },

  // Semantic Colors
  semantic: {
    success: '#43A047',
    warning: '#F4B942',
    error: '#DC2626',
    info: '#43A047',
  },

  // Backgrounds (Shortcuts)
  background: {
    lightGreen: '#F7FFF8',
    cream: '#FFF8E7',
    gray: '#FAFAFA',
    white: '#FFFFFF',
  },
} as const;

export const typography = {
  // Font Sizes
  fontSize: {
    '4xl': '2.25rem',  // 36px → 48px (responsive)
    '2xl': '1.5rem',   // 24px
    'lg': '1.125rem',  // 18px
    'base': '1rem',    // 16px
    'sm': '0.875rem',  // 14px
    'xs': '0.75rem',   // 12px
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,    // For headings (text-4xl, text-2xl)
    normal: 1.5,    // For body text
    relaxed: 1.75,  // For lead paragraphs
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',  // For large headings only
    normal: '0',
    wide: '0.025em',
  },
} as const;

export const spacing = {
  // Common gaps
  gap: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
  },

  // Common padding
  padding: {
    card: '1rem',           // 16px
    button: '2rem 0.75rem', // px-8 py-3
    buttonSm: '1rem 0.5rem', // px-4 py-2
  },
} as const;

export const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

/**
 * Tailwind classes as constants (for type safety and autocomplete)
 */
export const tw = {
  // Text Colors (most used)
  text: {
    heading: 'text-[#1F5E3B]',
    body: 'text-[#1F2937]',
    secondary: 'text-[#6B7280]',
    white: 'text-white',
    primary: 'text-[#43A047]',
    price: 'text-[#DC2626]',
    highlight: 'text-[#F4B942]',
  },

  // Backgrounds (most used)
  bg: {
    white: 'bg-white',
    gray: 'bg-[#FAFAFA]',
    greenLight: 'bg-[#DFF5E1]',
    cream: 'bg-[#FFF8E7]',
    primary: 'bg-[#43A047]',
    badge: 'bg-[#F4B942]',
  },

  // Typography combinations
  typography: {
    hero: 'text-4xl font-semibold leading-tight tracking-tight',
    h2: 'text-2xl font-semibold leading-tight',
    h3: 'text-2xl font-semibold leading-tight',
    lead: 'text-lg leading-relaxed',
    body: 'text-base',
    small: 'text-sm',
    tiny: 'text-xs',
    button: 'text-sm font-medium',
  },

  // Buttons
  button: {
    primary: 'px-8 py-3 bg-[#43A047] text-white rounded-full text-sm font-medium hover:bg-[#388E3C] transition-colors',
    secondary: 'px-8 py-3 border-2 border-[#43A047] text-[#43A047] rounded-full text-sm font-medium hover:bg-[#43A047] hover:text-white transition-colors',
    small: 'px-4 py-2 bg-[#43A047] text-white rounded-full text-sm font-medium hover:bg-[#388E3C] transition-colors',
  },

  // Cards
  card: {
    default: 'bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden',
    product: 'bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow',
  },

  // Badges
  badge: {
    default: 'px-3 py-1 bg-[#F4B942] text-white text-xs rounded-full',
    success: 'px-3 py-1 bg-[#43A047] text-white text-xs rounded-full',
  },
} as const;

/**
 * Helper function to merge Tailwind classes
 * Already exists in lib/utils.ts as cn()
 */

/**
 * Usage Examples:
 *
 * // With TypeScript constants:
 * <div style={{ color: colors.brand.greenPrimary }}>
 *
 * // With Tailwind classes:
 * <h1 className={tw.typography.hero + ' ' + tw.text.heading}>
 *   Hero Title
 * </h1>
 *
 * // Or better with cn():
 * import { cn } from '@/lib/utils';
 * <h1 className={cn(tw.typography.hero, tw.text.heading)}>
 *   Hero Title
 * </h1>
 *
 * // Direct usage:
 * <button className={tw.button.primary}>
 *   Mua ngay
 * </button>
 */

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  tw,
};
