'use client'
import { useTheme } from './ThemeProvider'

export default function DarkModeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 text-white/70 hover:text-white transition-colors text-base leading-none"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
