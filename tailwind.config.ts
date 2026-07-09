import type { Config } from 'tailwindcss'

/**
 * Safar "Ocean Breeze" theme (design V1.1). Colours come in two sets:
 *   - Named brand colours (cream, sea, sky, …) — direct, expressive utilities.
 *   - shadcn semantic colours (background, primary, …) reading the HSL CSS
 *     variables defined in globals.css, so shadcn/ui components are on-brand.
 *
 * The names are retained from the V1 "Sea & Sand" system to keep the swap
 * low-risk; only the values changed. Reads: cream = airy near-white surface /
 * light text on dark; sea = ocean teal (primary); sky = bright cyan (eyebrows
 * on dark); sand = soft sky band; pine = fresh green (action/price, AA on
 * white); mint = soft accent; ink = deep slate text.
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
        // Named brand palette — Ocean Breeze (design V1.1)
        cream: '#f0f8ff', // airy alice-blue: page surface + light text on dark
        sand: '#e0f2fe', // soft sky band
        sea: '#0e7490', // ocean teal (primary)
        sky: '#7dd3fc', // bright cyan — eyebrows on dark scrims
        // Fresh green for action/price text on light surfaces (≥4.5:1 on white).
        pine: '#15803d',
        mint: '#d1fae5', // soft accent tint
        ink: '#243447', // deep slate (text)
        gold: '#5eead4', // teal-mint glow (hero backdrop)

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
      // Fluid type scale — the clamp() values live as CSS variables in
      // globals.css (see there) so `text-base`…`text-6xl` scale continuously
      // between mobile and desktop. `xs`/`sm` keep Tailwind's fixed sizes;
      // line-heights are unitless so leading tracks the fluid size.
      fontSize: {
        base: ['var(--text-base)', { lineHeight: '1.6' }],
        lg: ['var(--text-lg)', { lineHeight: '1.6' }],
        xl: ['var(--text-xl)', { lineHeight: '1.5' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.25' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '1.15' }],
        '5xl': ['var(--text-5xl)', { lineHeight: '1.05' }],
        '6xl': ['var(--text-6xl)', { lineHeight: '1.02' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 0.25rem)',
        sm: 'calc(var(--radius) - 0.4rem)',
        '2xl': 'calc(var(--radius) + 0.5rem)',
      },
      spacing: {
        // Vertical rhythm for page sections — fluid clamp() tokens (defined in
        // globals.css) so `py-section` scales continuously mobile → desktop.
        section: 'var(--space-section)',
        'section-lg': 'var(--space-section-lg)',
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        // Soft, breezy elevation; `lift` is the hover-lift resting/raised pair.
        soft: '0 1px 2px rgba(36, 52, 71, 0.06), 0 8px 24px rgba(36, 52, 71, 0.06)',
        lift: '0 12px 32px rgba(36, 52, 71, 0.14)',
      },
    },
  },
  plugins: [],
}

export default config
