/** Shared design tokens. CSS modules consume the matching variables in globals.css. */
export const theme = {
  colors: {
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    textSubtle: 'var(--color-text-subtle)',
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    surfaceSoft: 'var(--color-surface-soft)',
    border: 'var(--color-border)',
    borderStrong: 'var(--color-border-strong)',
    primary: 'var(--color-primary)',
    accent: 'var(--color-accent)',
    focus: 'var(--color-focus)'
  },
  spacing: {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)',
    '2xl': 'var(--space-2xl)',
    '3xl': 'var(--space-3xl)'
  },
  typography: {
    scale: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      md: 'var(--font-size-md)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      xxl: 'var(--font-size-xxl)',
      xxxl: 'var(--font-size-xxxl)',
      '2xl': 'var(--font-size-2xl)'
    },
    eyebrow: {
      fontSize: 'var(--font-size-eyebrow)',
      lineHeight: 'var(--line-height-eyebrow)',
      letterSpacing: 'var(--letter-spacing-eyebrow)'
    },
    body: {
      fontSize: 'var(--font-size-body)',
      lineHeight: 'var(--line-height-body)'
    },
    caption: {
      fontSize: 'var(--font-size-caption)',
      lineHeight: 'var(--line-height-caption)'
    },
    title: {
      fontSize: 'var(--font-size-title)',
      lineHeight: 'var(--line-height-title)'
    }
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    round: 'var(--radius-round)'
  },
  shadow: {
    page: 'var(--shadow-page)',
    card: 'var(--shadow-card)',
    artwork: 'var(--shadow-artwork)',
    focus: 'var(--shadow-focus)'
  }
} as const;

export type Theme = typeof theme;
