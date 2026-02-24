import React, { useRef, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Sparkles, FileJson, Play } from 'lucide-react'

type Props = {
  value: string
  onChange: (v: string) => void
  onExplain: () => void
  onLoadExample: () => void
}

export default function EditorPanel({ value, onChange, onExplain, onLoadExample }: Props) {
  const editorRef = useRef<any>(null)
  const [monacoReady, setMonacoReady] = useState(true)

  useEffect(() => {
    if (!Editor) setMonacoReady(false)
  }, [])

  const prettify = () => {
    try {
      const json = JSON.stringify(JSON.parse(value), null, 2)
      onChange(json)
    } catch {
      alert('Invalid JSON')
    }
  }

  return (
    <div className="liquid-glass flex flex-col h-full w-full">
      <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-xl border border-white/5 shadow-inner">
            <FileJson className="h-5 w-5 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide font-sans">Input Logs</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline py-2 px-4 shadow-sm" onClick={prettify} aria-label="Prettify JSON">
            <Sparkles className="h-4 w-4 text-brand-300" />
            <span className="hidden sm:inline font-semibold opacity-90">Prettify</span>
          </button>
          <button className="btn btn-primary shadow-brand-500/50" onClick={onExplain} aria-label="Explain logs">
            <Play className="h-4 w-4 fill-white" />
            <span className="font-bold tracking-wider uppercase text-xs">Analyze</span>
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-surface/80 m-4 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
        {monacoReady ? (
          <div className="absolute inset-0 pt-2">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={value}
              onChange={(v) => onChange(v || '')}
              onMount={(editor) => { editorRef.current = editor }}
              options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono', scrollBeyondLastLine: false, renderWhitespace: 'none', padding: { top: 16, bottom: 16 }, lineNumbersMinChars: 4 }}
            />
          </div>
        ) : (
          <textarea className="w-full h-full min-h-[300px] p-6 bg-transparent text-sm resize-none focus:outline-none font-mono text-slate-300" value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.05] bg-white/[0.01] p-4">
        <button className="btn btn-ghost text-xs hover:bg-white/10" onClick={onLoadExample} aria-label="Load example">
          Load Example Data
        </button>
        <a className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); alert('Docs coming soon') }}>
          Need Help?
        </a>
      </div>
    </div>
  )
}
