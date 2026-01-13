// Prefer backend URL from Vite env: VITE_BACKEND_URL
const ENV_BACKEND = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_BACKEND_URL) || ''
const BACKEND = typeof ENV_BACKEND === 'string' && ENV_BACKEND.length > 0 ? ENV_BACKEND.replace(/\/$/, '') : ''

export async function explain(logs: any[]) {
  // If BACKEND is provided, call `${BACKEND}/explain`, otherwise use local proxy endpoint `/explain` (useful for dev)
  const url = BACKEND ? `${BACKEND}/explain` : '/explain'
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ logs }) })
  if (!res.ok) throw new Error(`server ${res.status}`)
  return res.json()
}

export default { explain }
