import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
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

    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

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
