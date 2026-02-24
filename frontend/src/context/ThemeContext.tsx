import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = {
    theme: Theme
    toggleTheme: (e?: React.MouseEvent) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme === 'light' || savedTheme === 'dark') {
                return savedTheme
            }
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
        }
        return 'dark'
    })

    useEffect(() => {
        localStorage.setItem('theme', theme)
        if (theme === 'light') {
            document.documentElement.classList.add('light')
        } else {
            document.documentElement.classList.remove('light')
        }
    }, [theme])

    const toggleTheme = (e?: React.MouseEvent) => {
        const isDark = theme === 'dark'

        // @ts-ignore - startViewTransition is not yet in all TS types
        if (!document.startViewTransition || !e) {
            setTheme(isDark ? 'light' : 'dark')
            return
        }

        const x = e.clientX
        const y = e.clientY
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        )

        // @ts-ignore
        const transition = document.startViewTransition(() => {
            // Apply the new theme to the DOM instantly so the transition captures it correctly
            if (isDark) {
                document.documentElement.classList.add('light')
            } else {
                document.documentElement.classList.remove('light')
            }
            // Update React state
            import('react-dom').then((ReactDOM) => {
                ReactDOM.flushSync(() => {
                    setTheme(isDark ? 'light' : 'dark')
                })
            }).catch(() => {
                setTheme(isDark ? 'light' : 'dark')
            })
        })

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ]

            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 500,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            )
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within ThemeProvider')
    return context
}
