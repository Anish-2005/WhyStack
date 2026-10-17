import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ThemeContext, type Theme } from './useTheme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    // Storage can be unavailable in private browsing modes.
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try {
      window.localStorage.setItem('theme', theme)
    } catch {
      // The current theme remains usable when storage is unavailable.
    }
  }, [theme])

  function toggleTheme(event?: MouseEvent<HTMLButtonElement>) {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    if (typeof document.startViewTransition !== 'function' || !event) {
      setTheme(nextTheme)
      return
    }

    const { clientX, clientY } = event
    const radius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY),
    )

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle('light', nextTheme === 'light')
      flushSync(() => setTheme(nextTheme))
    })

    void transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`] },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    }).catch(() => setTheme(nextTheme))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
