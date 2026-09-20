import { lazy, Suspense, useState } from 'react'
import { FileJson, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/useTheme'

const Editor = lazy(() => import('./JsonEditor'))

type Props = {
  value: string
  onChange: (value: string) => void
  onExplain: () => void
  onLoadExample: () => void
  isAnalyzing: boolean
}

export default function EditorPanel({ value, onChange, onExplain, onLoadExample, isAnalyzing }: Props) {
  const { theme } = useTheme()
  const [editorMessage, setEditorMessage] = useState('')

  function prettify() {
    try {
      onChange(JSON.stringify(JSON.parse(value), null, 2))
      setEditorMessage('')
    } catch {
      setEditorMessage('The editor content is not valid JSON.')
    }
  }

  return (
    <div className="liquid-glass flex flex-col h-full w-full">
      <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-xl border border-white/5 shadow-inner" aria-hidden="true">
            <FileJson className="h-5 w-5 text-brand-400" />
          </div>
          <h2 id="input-heading" className={`text-xl font-bold tracking-wide font-sans ${theme === 'light' ? '!text-black' : 'text-white'}`}>Input logs</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline py-2 px-4 shadow-sm" onClick={prettify} disabled={isAnalyzing} aria-label="Format JSON">
            <Sparkles className={`h-4 w-4 ${theme === 'light' ? '!text-black' : 'text-brand-300'}`} aria-hidden="true" />
            <span className={`hidden sm:inline font-semibold opacity-90 ${theme === 'light' ? '!text-black' : ''}`}>Format</span>
          </button>
          <button className="btn btn-primary shadow-brand-500/50" onClick={onExplain} disabled={isAnalyzing}>
            <Play className={`h-4 w-4 ${theme === 'light' ? 'fill-black' : 'fill-white'}`} aria-hidden="true" />
            <span className={`font-bold tracking-wider uppercase text-xs ${theme === 'light' ? '!text-black' : ''}`}>{isAnalyzing ? 'Analyzing…' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      <p id="editor-help" className="px-4 pt-3 text-xs text-slate-400">Paste a JSON array or an object with a logs array. Maximum 5,000 events.</p>
      <div className="flex-1 relative bg-surface/80 m-4 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
        <Suspense fallback={(
          <textarea
            className="absolute inset-0 w-full h-full min-h-[300px] p-6 bg-transparent text-sm resize-none focus:outline-none font-mono text-slate-300"
            aria-label="JSON telemetry events"
            aria-describedby="editor-help"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}>
          <div className="absolute inset-0 pt-2">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme={theme === 'light' ? 'light' : 'vs-dark'}
              value={value}
              onChange={(nextValue) => onChange(nextValue || '')}
              options={{
                ariaLabel: 'JSON telemetry events',
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono',
                scrollBeyondLastLine: false,
                renderWhitespace: 'none',
                padding: { top: 16, bottom: 16 },
                lineNumbersMinChars: 4,
              }}
            />
          </div>
        </Suspense>
      </div>

      {editorMessage && <p className="px-4 pb-2 text-sm text-rose-400" role="alert">{editorMessage}</p>}

      <div className="flex items-center justify-between border-t border-white/[0.05] bg-white/[0.01] p-4">
        <button className="btn btn-ghost text-xs hover:bg-white/10" onClick={onLoadExample} disabled={isAnalyzing}>
          Load example data
        </button>
        <Link className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors cursor-pointer" to="/docs">
          Need help?
        </Link>
      </div>
    </div>
  )
}
