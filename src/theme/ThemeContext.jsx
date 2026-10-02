// ============================================================================
//  GestiPerso — Theme provider (light / dark / auto)
// ----------------------------------------------------------------------------
//  Single source of truth for the appearance of the application.
//  - persists the choice in localStorage (THEME_STORAGE_KEY)
//  - paints <html data-theme="light|dark"> so the SCSS tokens react instantly
//  - "auto" follows the OS (prefers-color-scheme) and updates live
//  - mirrors the value into the redux store (`theme`) for legacy readers
// ============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from '../config/theme'

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  resolvedTheme: 'light',
  setTheme: () => {},
})

const readStored = () => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.includes(raw) ? raw : null
  } catch {
    return null
  }
}

const systemPrefersDark = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const resolveTheme = (theme) => (theme === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : theme)

const paintDocument = (resolved) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  root.style.colorScheme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0b1220' : '#1d4ed8')
}

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch()
  const storedInRedux = useSelector((state) => state.theme)
  const [theme, setThemeState] = useState(() => readStored() || storedInRedux || DEFAULT_THEME)
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme))

  const setTheme = useCallback(
    (next) => {
      const value = THEMES.includes(next) ? next : DEFAULT_THEME
      setThemeState(value)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value)
      } catch {
        /* private mode — the theme still applies for this session */
      }
      dispatch({ type: 'set', theme: value })
    },
    [dispatch],
  )

  // Paint + keep in sync when the choice or the OS preference changes.
  useEffect(() => {
    setResolvedTheme(resolveTheme(theme))
  }, [theme])

  useEffect(() => {
    paintDocument(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    if (theme !== 'auto' || typeof window?.matchMedia !== 'function') return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolvedTheme(resolveTheme('auto'))
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [theme])

  // First paint as early as possible (avoids a light flash on reload).
  useEffect(() => {
    paintDocument(resolveTheme(readStored() || DEFAULT_THEME))
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

ThemeProvider.propTypes = { children: PropTypes.node }

export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider
