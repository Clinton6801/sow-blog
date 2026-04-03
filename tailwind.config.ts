import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        blackletter: ['var(--font-unifraktur)', 'cursive'],
      },
      colors: {
        ink: '#1a1a2e',
        paper: '#fffef9',
        cream: '#fff8f0',
        sow: {
          blue:   '#1e3a8a',
          red:    '#dc2626',
          gold:   '#f59e0b',
          green:  '#16a34a',
          purple: '#7c3aed',
          teal:   '#0891b2',
        },
      },
    },
  },
  plugins: [],
}
export default config
