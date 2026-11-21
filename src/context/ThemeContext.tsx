/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeContextValue = { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start each page load in light mode; users can switch during their visit.
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light') }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used within ThemeProvider')
  return value
}
