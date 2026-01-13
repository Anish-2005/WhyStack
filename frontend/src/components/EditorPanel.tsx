import React, { useRef, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

type Props = {
  value: string
  onChange: (v: string) => void
  onExplain: () => void
  onLoadExample: () => void
}

export default function EditorPanel({ value, onChange, onExplain, onLoadExample }: Props) {
  const editorRef = useRef<any>(null)
  const [monacoReady, setMonacoReady] = useState(true)

  // If Monaco fails to load in some environments, fallback to textarea
  useEffect(() => {
    // simple detection: Editor should be defined
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
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Input</h2>
        <div className="editor-controls" style={{ gap: 8 }}>
          <button className="btn btn-outline text-sm" onClick={prettify} aria-label="Prettify JSON">Prettify</button>
          <button className="btn btn-primary text-sm" onClick={onExplain} aria-label="Explain logs">Explain</button>
        </div>
      </div>

      {monacoReady ? (
        <div className="editor-container">
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={value}
            onChange={(v) => onChange(v || '')}
            onMount={(editor) => { editorRef.current = editor }}
            options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, renderWhitespace: 'boundary' }}
          />
        </div>
      ) : (
        <textarea className="editor-textarea" value={value} onChange={(e) => onChange(e.target.value)} />
      )}

      <div className="mt-3 editor-controls" style={{ justifyContent: 'space-between', width: '100%' }}>
        <div style={{flex: '1 1 auto'}}>
          <button className="btn btn-outline text-sm" onClick={onLoadExample} aria-label="Load example">Load example</button>
        </div>

        <div style={{flex: '0 0 auto'}}>
          <a className="text-sm text-gray-400" href="#" onClick={(e) => { e.preventDefault(); alert('Docs coming soon') }}>Quick help</a>
        </div>
      </div>
    </div>
  )
}
