document.getElementById('btn').addEventListener('click', async () => {
  const txt = document.getElementById('input').value;
  let logs;
  try { logs = JSON.parse(txt); } catch (e) { document.getElementById('out').textContent = 'Invalid JSON'; return; }

  const res = await fetch('/explain', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ logs }) });
  const data = await res.json();
  document.getElementById('out').textContent = JSON.stringify(data, null, 2);
});
