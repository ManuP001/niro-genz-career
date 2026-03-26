const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Call the Mira backend (mira-api service, powered by Gemini).
 * Returns the full response object: { text, recommendation?, parseError? }
 */
export async function callMira(messages, phase, userName, topicId = null) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      phase,
      userName,
      topicId,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Mira is taking a moment. Try again in a few seconds.');
  }

  return response.json(); // { text, recommendation?, parseError? }
}
