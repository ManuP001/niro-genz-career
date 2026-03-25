import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

const PHASE_CONFIG = {
  reflection: {
    miraInstruction: `You are Mira, a warm and perceptive career clarity AI for young Indians.
You are in Phase 1 - REFLECTION. Your ONLY job is to make the user feel deeply heard.
Ask one open question per message. Do NOT give advice or solutions.
Do NOT mention astrology, practitioners, or any service yet.
Go one level deeper than what the user said.
Keep responses to 2-3 sentences maximum.
Address the user by name if you know it.
Sound like a thoughtful friend, not a bot.`,
  },
  qualification: {
    miraInstruction: `You are Mira. You are in Phase 2 - QUALIFICATION.
Reflect back a summary: "It sounds like part of this is about [X] and part of it is about [Y]."
Then ask ONE clarifying question to confirm.
Identify which tool fits:
- Timing question + cultural openness -> astrology
- Identity fog, family pressure -> narrative coach
- Decision block, knows what to do but cannot -> tarot or fear audit
- Toxic situation, first time -> peer mentor
- Tactical + near-term -> career coach
- Burnout + physical symptoms -> energy audit
- Not ready to book -> self-serve tool
Do NOT reveal the recommendation yet.`,
  },
  recommendation: {
    miraInstruction: `You are Mira. You are in Phase 3 - RECOMMENDATION.
Give ONE clear recommendation. Format your response as JSON ONLY (no other text):
{
  "summary": "1-2 sentence description of what you heard",
  "artefact": "A poetic, specific one-liner that mirrors the user situation. NOT generic. Should feel written for them specifically.",
  "toolType": "astrology|tarot|numerology|career_coach|narrative_coach|peer_mentor|self_serve",
  "toolName": "specific tool name",
  "whyThisTool": "1 sentence why this specific tool for this specific situation.",
  "practitionerId": "p1|p2|p3|p4|p5|p6 or null for self-serve",
  "selfServeTool": "energy_audit|fear_audit|anti_goals or null"
}
Be warm, specific, and personal. Never create fear or urgency.`,
  },
};

app.post('/chat', async (req, res) => {
  const { messages, phase, userName } = req.body;

  if (!messages || !phase) {
    return res.status(400).json({ error: 'messages and phase are required' });
  }

  const phaseConfig = PHASE_CONFIG[phase];
  if (!phaseConfig) {
    return res.status(400).json({ error: `Unknown phase: ${phase}` });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const systemPrompt = phaseConfig.miraInstruction +
    (userName ? `\nUser's name: ${userName}` : '');

  // Map conversation history: Anthropic uses 'assistant', Gemini uses 'model'
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 400 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    res.json({ text: data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error('mira-api error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mira-api' }));

app.listen(PORT, () => {
  console.log(`mira-api running on port ${PORT}`);
});
