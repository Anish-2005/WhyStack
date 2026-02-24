import React from 'react'
import { motion } from 'framer-motion'

export function LogoIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
                </linearGradient>
                <radialGradient id="logoGlow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Top Stack Layer */}
            <path d="M12 2.5L3.5 6.5L12 10.5L20.5 6.5L12 2.5Z" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2.5L3.5 6.5L12 10.5L20.5 6.5L12 2.5Z" fill="url(#logoGradient)" fillOpacity="0.15" />

            {/* Middle Stack Layer */}
            <path d="M3.5 11.5L12 15.5L20.5 11.5" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

            {/* Bottom Stack Layer */}
            <motion.path
                d="M3.5 16.5L12 20.5L20.5 16.5"
                stroke="url(#logoGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
            />

            {/* Glowing Root Cause Node */}
            <motion.circle
                cx="12" cy="15.5" r="4"
                fill="url(#logoGlow)"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />

            {/* Tracer Beam */}
            <motion.path
                d="M12 2.5V15.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <path d="M12 15.5V20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" opacity="0.6" />
        </svg>
    )
}
