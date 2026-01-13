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
        <div className="flex" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-outline text-sm" onClick={prettify}>Prettify</button>
          <button className="btn btn-primary text-sm" onClick={onExplain}>Explain</button>
        </div>
      </div>

      {monacoReady ? (
        <div className="editor-container" style={{ height: '18rem' }}>
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
        <textarea className="w-full h-72 p-3 bg-gray-800 text-sm rounded" value={value} onChange={(e) => onChange(e.target.value)} />
      )}

      <div className="mt-3" style={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <button className="btn btn-outline text-sm" onClick={onLoadExample}>Load example</button>
        </div>

        <div>
          <a className="text-sm text-gray-400" href="#" onClick={(e) => { e.preventDefault(); alert('Docs coming soon') }}>Quick help</a>
        </div>
      </div>
    </div>
  )
}
