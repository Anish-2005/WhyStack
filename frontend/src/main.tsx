import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import Docs from './pages/Docs'
import Rules from './pages/Rules'
import About from './pages/About'
import NotFound from './pages/NotFound'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MotionConfig>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
