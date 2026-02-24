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
    <div className="glass-panel flex flex-col h-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 px-2">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-semibold text-white tracking-wide">Input Logs</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline py-1.5 px-3 text-xs" onClick={prettify} aria-label="Prettify JSON">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Prettify</span>
          </button>
          <button className="btn btn-primary py-1.5 px-4 text-xs font-bold uppercase tracking-wider shadow-brand-500/30" onClick={onExplain} aria-label="Explain logs">
            <Play className="h-4 w-4 fill-current" />
            Analyze
          </button>
        </div>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border border-white/5 bg-[#05050A]">
        {monacoReady ? (
          <div className="absolute inset-0">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={value}
              onChange={(v) => onChange(v || '')}
              onMount={(editor) => { editorRef.current = editor }}
              options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, renderWhitespace: 'boundary', padding: { top: 16, bottom: 16 } }}
            />
          </div>
        ) : (
          <textarea className="w-full h-full min-h-[300px] p-4 bg-transparent text-sm resize-none focus:outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 px-2">
        <button className="btn btn-ghost text-xs" onClick={onLoadExample} aria-label="Load example">
          Load Example Data
        </button>
        <a className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); alert('Docs coming soon') }}>
          Need Help?
        </a>
      </div>
    </div>
  )
}
