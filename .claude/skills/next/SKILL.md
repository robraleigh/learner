---
description: Advance to the next item on the Build Map. Determines whether the item should be student-written or generate-and-review, teaches the concept, and marks complete only after demonstrated understanding.
allowed-tools: Read, Write, Edit
---

# /next Skill

Read `.learner/build-map.md` to find the first unchecked item. Read `.learner/config.json` for the student's current stage. Then work through that item using the correct mode.

## Determine the Mode

**Use Guided Writing (student writes) when:**
- The concept is foundational (variables, basic conditionals, simple functions)
- It's something she should own completely
- Stage 0 or 1, and the concept is brand new

**Use Generate and Review when:**
- The pattern is complex or boilerplate-heavy
- Showing what's possible first will be more motivating than struggling from scratch
- The goal is reading/understanding, not necessarily writing from zero

When in doubt for foundational concepts: guided writing. When in doubt for structural patterns: generate and review.

---

## Guided Writing Protocol

1. **Explain the concept** — plain English, one analogy, no code yet.
   - Keep it to 3–5 sentences max.
   - End with: "Does that make sense before we write anything?"

2. **Ask her to attempt it** — be specific about what to write.
   - "Have a go at writing a function called `checkAnswer` that takes two things: what she typed and what the correct answer is."
   - Don't give her the answer. Let her struggle a little — that's where learning happens.

3. **Review her attempt** — name what's right first.
   - "You got the function name right, and using `if` here is exactly correct."
   - Then address one issue at a time. Never list everything wrong at once.

4. **Explain corrections** — never just fix it, always explain why.
   - "The reason we use `===` instead of `==` is..."
   - She makes the fix herself. You don't edit her file.

5. **Confirm understanding** — before marking complete.
   - "Can you explain in one sentence what this function does?"
   - If she can't, try a different angle. Don't move on until she can.

---

## Generate and Review Protocol

1. **Signal what's coming** — brief explanation of what you'll generate and why.
   - "This next part has a specific pattern that's worth seeing first. I'll write it, then walk you through every line."

2. **Generate the code** — write it to the appropriate file.

3. **Walk through it** — explain each meaningful section.
   - Don't explain every line mechanically. Group related lines, explain the intent.
   - Use the analogy bank from CLAUDE.md.

4. **Update `.learner/state.json`** — set `pendingReview.active: true` with a real question:
   ```json
   "pendingReview": {
     "active": true,
     "filePath": "quiz.js",
     "questionLevel": 1,
     "question": "Point to the line that checks whether the answer is correct.",
     "format": "text",
     "hints": [
       "Look for where two values are being compared...",
       "The === operator is doing the comparison. What are the two things on either side of it?",
       "Line 8: userAnswer === correctAnswer. The left side is what she typed; the right side is the stored correct answer."
     ],
     "hintsUsed": 0
   }
   ```

5. **Tell her** — "I've put a question in the sidebar — answer it before we move on."

---

## Marking Complete

Only mark an item complete when:
- She has explained what the code does in her own words, AND
- The code actually works (she's run it)

To mark complete:
1. Update `.learner/build-map.md` — change `- [ ]` to `- [x]` for the current item
2. Update `.learner/state.json` — increment `currentBuildMapItem`, set `pendingReview.active: false`
3. Award 100 XP — update `xp` in both `state.json` and `progress.json`
4. Check for level up — compare new XP to level thresholds in CLAUDE.md
5. Celebrate specifically — name the skill she just earned, not generic praise.
   - "That's your `checkAnswer` function working. You just wrote a function that takes input, makes a decision, and returns a result. That pattern — input → decision → output — is in almost every program ever written."

---

## Always End With

Either a concrete task ("Now run it: `node quiz.js`") or a question ("What do you think would happen if the user typed the answer in capitals?"). Never end a `/next` session with a monologue.
