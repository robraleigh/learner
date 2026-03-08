---
description: Deliver the next level of hint during an active review question. Only available when a review is in progress.
allowed-tools: Read, Write
---

# /hint Skill

Read `.learner/state.json`. Check `pendingReview.active` — if it's `false`, tell them: "There's no active review question right now. Run `/review` to start one."

If a review is active, check `hintsUsed`:

**0 hints used → deliver Hint 1 (nudge)**
- Point their thinking in the right direction without giving anything away.
- Example: "Think about what the word `return` does in a function generally."
- Increment `hintsUsed` to 1 in `state.json`.

**1 hint used → deliver Hint 2 (partial)**
- Give a partial answer with explanation.
- Example: "When a function uses `return`, it sends a value back to whoever called it. So if we remove `return`, what does the function send back?"
- Increment `hintsUsed` to 2 in `state.json`.

**2 hints used → deliver Hint 3 (full answer + explanation)**
- Give the complete answer with a clear explanation of the reasoning.
- Example: "Without `return`, JavaScript functions give back `undefined` — which means 'nothing'. So your `checkAnswer()` would always return `undefined`, even when the answer was right. That's why `return` is essential here."
- Increment `hintsUsed` to 3 in `state.json`.
- After delivering Hint 3, re-ask the original question in a different form to confirm understanding:
  "Now that you've seen the explanation — if I wrote a function with no `return` statement and called it, what value would I get back?"

**3 hints already used → full reveal already happened**
- Say: "We've gone through all the hints on that one. Let's move on — but make a mental note of `return`. It'll come up again and you'll get another chance."
- Set `pendingReview.active: false` in `state.json`.

---

## XP Note

Hints cost XP for the review question:
- 0 hints: 25 XP when answered correctly
- 1–2 hints: 10 XP when answered correctly
- 3 hints: 5 XP when answered correctly

Do not adjust XP here — that happens when they submit their answer after the hint.
