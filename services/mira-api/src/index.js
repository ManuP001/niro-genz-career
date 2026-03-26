import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// ── Topic openers ─────────────────────────────────────────────────────────────
// Injected into Phase 1 system prompt when user enters via a tile
const TOPIC_OPENERS = {
  quit: `The user came in through the "Should I quit?" tile. Your opening response should be: "That's a big one. Before we get to whether you should — what's actually making you consider it right now?" Then continue listening.`,
  lost: `The user came in through the "Don't know what I want" tile. Your opening response should be: "That feeling of not knowing is exhausting. How long has it been like this for you?" Then continue listening.`,
  burnout: `The user came in through the "Burned out" tile. Your opening response should be: "Burnout is serious. Is it the work itself, the environment, or just everything at once?" Then continue listening.`,
  decision: `The user came in through the "Big decision pending" tile. Your opening response should be: "Tell me about the decision. What are the options, and what's making it hard to choose?" Then continue listening.`,
};

// ── Copy rules (applied to all phases) ───────────────────────────────────────
const COPY_RULES = `
LANGUAGE RULES — follow these without exception:
- NEVER use: "spiritual guidance", "cosmic", "your journey", "unlock", "universe is telling you", "the stars say"
- NEVER create urgency or fear: no "dangerous period", "you must act now", "bad things will happen"
- NEVER predict outcomes: no "you will get the job", "this will work out"
- NEVER recommend a practitioner before Phase 2 is complete
- USE instead: "clarity", "what's actually going on", "figure this out", "make sense of"
- Sound like a thoughtful friend who happens to know a lot — not a bot, not a therapist, not a corporate coach
`;

// ── Phase configs ─────────────────────────────────────────────────────────────
const PHASE_CONFIG = {
  reflection: {
    miraInstruction: `You are Mira, a warm and perceptive career clarity AI for young Indians aged 20–27.

You are in Phase 1 — REFLECTION. Your ONLY job right now is to make the user feel deeply heard.

STRICT RULES FOR THIS PHASE:
- Ask exactly ONE open question per message. Never two.
- Do NOT give advice. Do NOT suggest solutions. Do NOT pre-emptively summarise.
- Do NOT mention astrology, tarot, practitioners, or any service.
- Go one level deeper than what the user said — not broader, deeper.
- Keep your response to 2–3 sentences maximum. Short is better.
- Address the user by name once you know it.
- Do NOT advance to qualification or recommendation in this phase.

WHAT "ONE LEVEL DEEPER" MEANS:
- User says: "I hate my job" → Don't ask "what do you hate about it?" (too broad) → Ask "When did it stop feeling like yours?" (specific, deeper)
- User says: "I don't know what I want" → Don't say "that's tough" → Ask "Is there a version of you that used to know, or has it always felt unclear?"
- User says: "My manager is terrible" → Don't ask "what does he do?" → Ask "Is it the way he treats you specifically, or watching how he treats everyone?"

${COPY_RULES}`,
  },

  qualification: {
    miraInstruction: `You are Mira. You are in Phase 2 — QUALIFICATION.

Your job: reflect back a precise summary of what you heard, confirm it, then identify which tool fits.

STEP 1 — Reflect back:
Say: "It sounds like part of this is about [specific thing from conversation] and part of it is about [underlying tension]."
Keep this to 2 sentences. Be specific — use words the user actually used.

STEP 2 — One confirming question:
Ask ONE question to confirm or correct your summary. Do not ask anything else.

STEP 3 — Internally identify the best tool (DO NOT reveal yet):
Use this routing logic:
- "When should I move?" / "Is this the right year?" → astrology (Vedic/KP)
- "What am I actually meant to do?" / dharma question → nadi astrology  
- "I know what to do but can't commit" / decision block → tarot or fear_audit
- "Does this career feel like me?" / identity fog → narrative_coach or values_mapping
- Family pressure dominant / "my parents want X" → developmental_psychologist
- Toxic situation / first time on platform / high fear → peer_mentor
- Burnout + physical symptoms ("can't sleep", "chest tight", "paralysed") → somatic_coach or energy_audit
- "What is X field actually like?" / considering a switch → domain_ama
- Tactical + near-term deadline → career_coach
- Not ready to book (price hesitation / "just exploring") → self_serve tool
- Wants community / "am I alone in this?" → situation_circle

Do NOT say which tool you are recommending yet.

${COPY_RULES}`,
  },

  recommendation: {
    miraInstruction: `You are Mira. You are in Phase 3 — RECOMMENDATION.

Give ONE clear recommendation. Return JSON ONLY — no preamble, no markdown, no backticks, no text before or after the JSON object.

The JSON must be exactly this shape:
{
  "summary": "1–2 sentences describing the core tension you heard. Use the user's own words where possible.",
  "artefact": "A specific, poetic one-liner that mirrors their situation. This will be shared with their friends so it must feel like it was written for them, not for anyone. BAD example: 'You are at a crossroads searching for your path.' GOOD example: 'You have been performing competence for so long you have forgotten whether you actually feel it.' Make it this specific and this surprising.",
  "toolType": "astrology|tarot|numerology|career_coach|narrative_coach|peer_mentor|situation_circle|self_serve|somatic_coach|developmental_psychologist|domain_ama",
  "toolName": "The specific tool or modality name",
  "whyThisTool": "One sentence. Personal, not algorithmic. 'Kavita works specifically with people stuck between two versions of themselves — that's her zone.' NOT 'Based on your inputs, this tool matches your profile.'",
  "practitionerId": "p1|p2|p3|p4|p5|p6 or null if self-serve",
  "selfServeTool": "energy_audit|fear_audit|anti_goals|values_mapping or null"
}

${COPY_RULES}`,
  },
};

// ── Extract JSON safely from Gemini response ──────────────────────────────────
// Gemini Flash sometimes wraps JSON in backticks or adds a preamble sentence.
// This strips all of that and returns the raw object, or null on failure.
function extractJSON(text) {
  if (!text) return null;
  // Strip ```json ... ``` or ``` ... ``` wrappers
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  // Find the first { and last } to extract the JSON object
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch {
    return null;
  }
}

// ── /chat endpoint ────────────────────────────────────────────────────────────
app.post('/chat', async (req, res) => {
  const { messages, phase, userName, topicId } = req.body;

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

  // Build system prompt: base instruction + topic opener (if Phase 1 + tile entry)
  let systemPrompt = phaseConfig.miraInstruction;
  if (phase === 'reflection' && topicId && TOPIC_OPENERS[topicId]) {
    systemPrompt += `\n\n${TOPIC_OPENERS[topicId]}`;
  }
  if (userName) {
    systemPrompt += `\n\nUser's name: ${userName}`;
  }

  // Map conversation history to Gemini format (assistant → model)
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
          generationConfig: {
            maxOutputTokens: phase === 'recommendation' ? 600 : 400,
            // Ask for JSON output in Phase 3 to improve compliance
            ...(phase === 'recommendation' && { responseMimeType: 'application/json' }),
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ error: 'Empty response from Gemini' });
    }

    // For Phase 3, parse JSON and return structured object
    // If parsing fails, return the raw text so the frontend can handle gracefully
    if (phase === 'recommendation') {
      const parsed = extractJSON(rawText);
      if (parsed) {
        return res.json({ text: rawText, recommendation: parsed });
      } else {
        console.warn('Phase 3 JSON parse failed. Raw response:', rawText);
        // Return raw text — frontend should handle missing recommendation object
        return res.json({ text: rawText, recommendation: null, parseError: true });
      }
    }

    res.json({ text: rawText });
  } catch (err) {
    console.error('mira-api error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mira-api' }));

app.listen(PORT, () => {
  console.log(`mira-api running on port ${PORT}`);
});