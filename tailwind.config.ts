import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        blackletter: ['var(--font-unifraktur)', 'cursive'],
      },
      colors: {
        // Static brand colours
        ink:   '#1a1a2e',
        paper: '#fafaf7',
        cream: '#f4f3ef',
        sow: {
          blue:   '#1e3a8a',
          red:    '#dc2626',
          gold:   '#d97706',
          green:  '#15803d',
          purple: '#7c3aed',
          teal:   '#0e7490',
        },
        // Semantic tokens that follow dark/light mode via CSS variables
        surface: 'var(--bg-surface)',
        subtle:  'var(--bg-subtle)',
        muted:   'var(--bg-muted)',
      },
    },
  },
  plugins: [],
}
export default config
