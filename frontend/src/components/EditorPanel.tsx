import { useRef } from 'react'
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
        <div className="flex" style={{gap:8, flexWrap:'wrap', alignItems:'center'}}>
          <button className="btn btn-outline text-sm" onClick={() => {
            try {
              const json = JSON.stringify(JSON.parse(value), null, 2)
              onChange(json)
            } catch { alert('Invalid JSON') }
          }}>Prettify</button>
          <button className="btn btn-primary text-sm" onClick={onExplain}>Explain</button>
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

      <div className="mt-3" style={{display:'flex', gap:8, justifyContent:'space-between', flexWrap:'wrap'}}>
        <div>
          <button className="btn btn-outline text-sm" onClick={onLoadExample}>Load example</button>
        </div>

        <div>
          <a className="text-sm muted" href="#" onClick={(e)=>{e.preventDefault(); alert('Docs coming soon')}}>Quick help</a>
        </div>
      </div>
    </div>
  )
}
