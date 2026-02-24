import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isLight = theme === 'light'

    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/5 overflow-hidden"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: isLight ? 1 : 0,
                    opacity: isLight ? 1 : 0,
                    rotate: isLight ? 0 : -90,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute"
            >
                <Sun className="h-5 w-5 text-amber-500" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: isLight ? 0 : 1,
                    opacity: isLight ? 0 : 1,
                    rotate: isLight ? 90 : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Moon className="h-5 w-5 text-indigo-400" />
            </motion.div>
        </button>
    )
}
