# Niro — Project Instructions

## What This Product Is

Niro is a career clarity platform for 20–27 year olds in urban India. It is NOT an astrology app. Astrology is one tool among many. The category is career clarity. The tools (astrology, tarot, coaching, peer mentorship, self-serve exercises) are how different practitioners deliver it.

**Core design principle:** Situation in. Practitioner or tool recommendation out.

**Mira** is the persistent AI at the bottom of every screen. She does two things in sequence:
1. Reflection — helps the user articulate what's actually happening (Phase 1)
2. Routing — recommends the right tool or practitioner based on what emerged (Phase 2 → Phase 3)

Mira never gives the career answer herself. She creates the clarity that makes a human session worth having.

---

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS (utility classes only), mobile-first
- **Backend:** Node.js Express service (`services/mira-api/`)
- **AI API:** Gemini 2.0 Flash (primary) — see `.claude/rules/api-integration.md` for swap to Groq/Llama
- **Deploy:** Render (static frontend + Docker backend)
- **Max width:** 430px on mobile, responsive grid on tablet/desktop — see `.claude/rules/responsive-layout.md`

---

## Hard Constraints — Never Violate These

1. **Mira never gives advice before Phase 2 is complete.** Phase 1 is listening only.
2. **Mira never creates fear or urgency.** No "dangerous period", "you must act now", "bad things will happen".
3. **Mira never predicts outcomes.** No "you will get the job", "this will work out".
4. **Mira never recommends a practitioner before Phase 2 summary is confirmed.**
5. **No fear-based upselling anywhere in the product.** No urgency CTAs, no scarcity language.
6. **The app layout never exceeds 430px on mobile.** On desktop it uses a two-column layout.
7. **The Gemini API key never touches the frontend.** All AI calls go through `services/mira-api/`.

---

## Key Files

```
services/mira-api/index.js          ← AI backend, phase prompts, routing logic
frontend/src/context/AppContext.jsx  ← global state, phase management
frontend/src/screens/MiraScreen.jsx  ← Mira chat UI, phase advancement
frontend/src/screens/HomeScreen.jsx  ← tiles, chips, hero
frontend/src/components/MiraBar.jsx  ← persistent bar
frontend/src/components/BottomNav.jsx
```

---

## Do Not Touch

- `.env` files (never read or log API keys)
- `render.yaml` (deployment config, only change when explicitly asked)
- `services/mira-api/Dockerfile`

---

## When In Doubt

Before changing Mira's conversation logic → re-read `.claude/rules/mira-conversation.md`
Before any UI change → re-read `.claude/rules/design-tokens.md` and `.claude/rules/responsive-layout.md`
Before writing any copy → re-read `.claude/rules/copy-rules.md`
Before touching the API layer → re-read `.claude/rules/api-integration.md`
