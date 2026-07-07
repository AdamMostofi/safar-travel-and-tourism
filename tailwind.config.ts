import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sea & Sand palette from the brand brief (docs/brand/brand-brief.md).
        // The full token set (cream, sky, gold, dark theme) lands in the
        // design-system slice; these are the core four the tracer needs.
        cream: '#fbf7f0',
        sand: '#f1e7d6',
        sea: '#0c6e8a',
        sky: '#9ad4e4',
        coral: '#f4693b',
        ink: '#12333f',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
