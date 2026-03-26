---
description: Test the Mira phase state machine end-to-end across all 3 phases
---

## Phase machine test

Run the following test to verify that Phase 1 → 2 → 3 transitions work correctly.

### Step 1: Check phase advancement logic in MiraScreen

!`grep -n "phase\|userMessageCount\|qualification\|recommendation" frontend/src/components/MiraScreen.jsx 2>/dev/null || grep -rn "phase\|userMessageCount" frontend/src/components/ 2>/dev/null | head -40`

Verify:
- Phase advances to 'qualification' after exactly 3 user messages (not 2, not 4)
- Phase advances to 'recommendation' after 5–6 user messages total
- Phase is determined by message count, NOT by time or keywords

### Step 2: Check topicId is passed in API calls

!`grep -n "topicId\|entryTopic" frontend/src/components/MiraScreen.jsx 2>/dev/null || echo "WARNING: topicId not found in MiraScreen — tile context will be lost"`

If topicId is missing, the fix is:
```js
// In the fetch call to /chat, add:
topicId: state.mira.entryTopic || null,
```

### Step 3: Check Phase 3 response handling

!`grep -n "recommendation\|parseError\|RecommendationCard" frontend/src/components/MiraScreen.jsx 2>/dev/null | head -20`

Verify:
- `response.recommendation` is checked before rendering the card
- `parseError: true` has a fallback that renders `response.text` as a plain message
- No silent crashes on null recommendation

### Step 4: Check the API endpoint handles all three phases

!`grep -n "reflection\|qualification\|recommendation\|PHASE_CONFIG" services/mira-api/index.js | head -20`

Verify:
- All three phases exist in PHASE_CONFIG
- `topicId` is extracted from `req.body`
- `responseMimeType: 'application/json'` is set for Phase 3
- `maxOutputTokens: 600` for Phase 3, 400 for others

### Step 5: Check JSON extraction fallback exists

!`grep -n "extractJSON\|parseError\|JSON.parse" services/mira-api/index.js`

If `extractJSON` is missing, the Phase 3 JSON parse will crash on ~20% of Gemini responses.

### Summary

Report which checks passed and which failed. For each failure, show the specific line(s) that need changing and the exact fix.
