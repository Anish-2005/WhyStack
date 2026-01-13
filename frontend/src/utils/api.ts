export async function explain(logs: any[]) {
  const res = await fetch('/explain', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ logs }) })
  if (!res.ok) throw new Error(`server ${res.status}`)
  return res.json()
}
