---
description: Evaluate whether Mira's Phase 3 artefact is specific enough to be shareable
argument-hint: [optional: paste a conversation to test, or leave blank to use mock data]
---

## Artefact quality evaluation

The artefact is the single most important output in the entire product. If it's generic, the WOM engine doesn't work. This eval tests whether the current artefact instruction produces share-worthy output.

### Test conversations

Run the following three test scenarios through the live API and evaluate the artefact field in each response.

**Test 1 — Quit dilemma:**
```json
{
  "messages": [
    {"role": "user", "content": "I've been at this consulting job for 2 years and I dread Monday mornings. But I'm scared to quit because I don't know what else I'd do."},
    {"role": "assistant", "content": "That dread on Sunday nights — is it about the work itself, or is it more about the person you're becoming at this job?"},
    {"role": "user", "content": "Honestly both. I don't recognise myself anymore. I used to be curious about things and now I just feel numb."},
    {"role": "assistant", "content": "When did you last feel curious at work — even briefly?"},
    {"role": "user", "content": "Maybe 8 months ago when I was doing research for a client in education. I felt alive for like 3 weeks and then it was back to normal."},
    {"role": "assistant", "content": "It sounds like part of this is about the numbness itself — not just the job — and part of it is about a version of you that briefly showed up in that education project and then got buried again. Does that feel right?"},
    {"role": "user", "content": "Yes exactly. That's exactly it."}
  ],
  "phase": "recommendation",
  "userName": "Rahul",
  "topicId": "quit"
}
```

**Test 2 — Direction confusion:**
```json
{
  "messages": [
    {"role": "user", "content": "I'm 23 and I genuinely have no idea what I want to do. My friends all seem to have figured it out."},
    {"role": "assistant", "content": "Has there ever been a moment — even outside work — where time disappeared because you were so absorbed in something?"},
    {"role": "user", "content": "Yes, when I'm writing. But that's not a career."},
    {"role": "assistant", "content": "What makes you say that?"},
    {"role": "user", "content": "My parents would lose it. And I'm not good enough anyway."},
    {"role": "assistant", "content": "It sounds like part of this is about not knowing what you want, and part of it is about already knowing but not letting yourself want it. Is that close?"},
    {"role": "user", "content": "That's uncomfortably accurate."}
  ],
  "phase": "recommendation",
  "userName": "Priya",
  "topicId": "lost"
}
```

**Test 3 — Burnout:**
```json
{
  "messages": [
    {"role": "user", "content": "I can't sleep properly and my chest feels tight before every standup. I know I need to leave but I can't."},
    {"role": "assistant", "content": "That tightness before standups — is it about what might be said in the meeting, or just the act of having to show up and perform?"},
    {"role": "user", "content": "Just showing up. I'm so tired of pretending I'm fine."},
    {"role": "assistant", "content": "How long have you been pretending?"},
    {"role": "user", "content": "About a year. Since my manager changed."},
    {"role": "assistant", "content": "It sounds like the burnout is partly about exhaustion, and partly about the cost of keeping up a version of yourself that doesn't match what you're actually feeling. Does that sound right?"},
    {"role": "user", "content": "Yeah. I'm so tired of it."}
  ],
  "phase": "recommendation",
  "userName": "Arjun",
  "topicId": "burnout"
}
```

### Send each test to the live API

!`echo "Testing Phase 3 artefact quality..." && curl -s -X POST http://localhost:3001/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"I dread every Monday. I used to be curious and now I just feel numb. It started when my manager changed a year ago."},{"role":"assistant","content":"It sounds like the numbness and the job have become the same thing — but part of you remembers being different. Is that close?"},{"role":"user","content":"Exactly."}],"phase":"recommendation","userName":"Rahul","topicId":"quit"}' 2>/dev/null | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');try{const p=JSON.parse(d);console.log('ARTEFACT:',p.recommendation?.artefact||'MISSING');console.log('WHY:',p.recommendation?.whyThisTool||'MISSING');}catch(e){console.log('PARSE ERROR:',d.slice(0,200));}" || echo "API not running locally — evaluate manually against deployed API"`

### Evaluation criteria

For each artefact produced, score it 1–5 on:

1. **Specificity** (1 = could be anyone, 5 = clearly for this person)
2. **Surprise** (1 = obvious / clichéd, 5 = says something the user couldn't have said themselves)
3. **Screenshot test** (1 = no one would share this, 5 = I'd send this to a friend right now)

**Minimum passing score:** average 4/5 across all three tests.

If any artefact scores below 3 on the screenshot test, the artefact instruction in `PHASE_CONFIG.recommendation.miraInstruction` needs strengthening — add more bad/good examples showing the specificity level required.

### Report format

For each test:
- Show the artefact text produced
- Score it on all three criteria
- Flag pass/fail

If overall score < 4, show the specific improvement needed in the artefact instruction.
