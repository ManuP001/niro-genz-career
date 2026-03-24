const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function callMira(messages, phase, userName) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      phase,
      userName,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Mira service unavailable. Ensure mira-api is running.');
  }

  const data = await response.json();
  return data.text;
}
