import type { Config } from 'tailwindcss'

/**
 * Safar "Sea & Sand" theme (brand brief, ADR-0004). Colours come in two sets:
 *   - Named brand colours (cream, sand, sea, …) — direct, expressive utilities.
 *   - shadcn semantic colours (background, primary, …) reading the HSL CSS
 *     variables defined in globals.css, so shadcn/ui components are on-brand.
 */
const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        // Named brand palette
        cream: '#fbf7f0',
        sand: '#f1e7d6',
        sea: '#0c6e8a',
        sky: '#9ad4e4',
        coral: '#f4693b',
        // Accessible deep-coral for text/price on light surfaces (≥4.5:1 on
        // white); the bright `coral` fails AA as body text (issue #9 a11y pass).
        'coral-ink': '#bf4420',
        ink: '#12333f',
        gold: '#e0a63c',

        // shadcn semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 0.25rem)',
        sm: 'calc(var(--radius) - 0.4rem)',
        '2xl': 'calc(var(--radius) + 0.5rem)',
      },
      spacing: {
        // Vertical rhythm for page sections (mobile → desktop).
        section: '4rem',
        'section-lg': '7rem',
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        // Soft, breezy elevation; `lift` is the hover-lift resting/raised pair.
        soft: '0 1px 2px rgba(18, 51, 63, 0.06), 0 8px 24px rgba(18, 51, 63, 0.06)',
        lift: '0 12px 32px rgba(18, 51, 63, 0.14)',
      },
    },
  },
  plugins: [],
}

export default config
