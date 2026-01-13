import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'

type Props = {
  value: string
  onChange: (v: string) => void
  onExplain: () => void
  onLoadExample: () => void
}

export default function EditorPanel({ value, onChange, onExplain, onLoadExample }: Props) {
  const editorRef = useRef<any>(null)

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Input</h2>
        <div className="flex gap-2">
          <button className="text-sm px-3 py-1 border rounded" onClick={() => {
            try {
              const json = JSON.stringify(JSON.parse(value), null, 2)
              onChange(json)
            } catch { alert('Invalid JSON') }
          }}>Prettify</button>
          <button className="text-sm px-3 py-1 bg-indigo-600 text-white rounded" onClick={onExplain}>Explain</button>
        </div>
      </div>

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

      <div className="mt-3 text-right">
        <button className="text-sm px-3 py-1 border rounded mr-2" onClick={onLoadExample}>Load example</button>
      </div>
    </div>
  )
}
