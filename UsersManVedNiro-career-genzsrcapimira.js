export const PHASE_CONFIG = {
  reflection: {
    maxExchanges: 4,
    miraInstruction: ,
  },
  qualification: {
    maxExchanges: 2,
    miraInstruction: ,
  },
  recommendation: {
    miraInstruction: ,
  },
};

export async function callMira(messages, phase, userName) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to your .env file to chat with Mira.');
  }

  const systemPrompt = PHASE_CONFIG[phase].miraInstruction +
    (userName ?  : '');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Mira API error');
  }

  const data = await response.json();
  return data.content[0].text;
}
