---
description: Advance to the next item on the Build Map. Determines whether the item should be student-written or generate-and-review, teaches the concept, and marks complete only after demonstrated understanding.
---

# /next Skill

Read `.learner/active.json` to get `activeStudent` and `activeProject`. All state files for this session live at `.learner/students/[activeStudent]/projects/[activeProject]/`. Read `build-map.md` to find the first unchecked item. Read `config.json` for the student's current stage, `projectDir`, and `stack`. All code files you write go inside `projectDir` (e.g. `projects/my-quiz-app/quiz.js`). Then work through that item using the correct mode.

## Determine the Mode

**Use Guided Writing (student writes) when:**
- The concept is foundational (variables, basic conditionals, simple functions)
- It's something they should own completely
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

2. **Ask them to attempt it** — be specific about what to write.
   - "Have a go at writing a function called `checkAnswer` that takes two things: what they typed and what the correct answer is."
   - Don't give them the answer. Let them struggle a little — that's where learning happens.

3. **Review their attempt** — name what's right first.
   - "You got the function name right, and using `if` here is exactly correct."
   - Then address one issue at a time. Never list everything wrong at once.

4. **Explain corrections** — never just fix it, always explain why.
   - "The reason we use `===` instead of `==` is..."
   - They make the fix themselves. You don't edit their file.

5. **Confirm understanding** — before marking complete.
   - "Can you explain in one sentence what this function does?"
   - If they can't, try a different angle. Don't move on until they can.

---

## Generate and Review Protocol

1. **Signal what's coming** — brief explanation of what you'll generate and why.
   - "This next part has a specific pattern that's worth seeing first. I'll write it, then walk you through every line."

2. **Generate the code** — write it to `projectDir/[filename]` (e.g. `projects/my-quiz-app/quiz.js`).

3. **Walk through it** — explain each meaningful section.
   - Don't explain every line mechanically. Group related lines, explain the intent.
   - Use the analogy bank from CLAUDE.md.

4. **Badge annotation** — before writing `currentInstruction`, check `state.json.badgeProgress` for the badge most relevant to this task (highest `count/target` ratio among badges with `minStage ≤ currentStage`). Add it to `currentInstruction.subtext`:
   - "Working toward: ⚒️ Function Forger (2/3)"
   - If count is 0: "(0/3 — let's start the streak)"
   - If the student just earned a badge this step, celebrate it first before setting the new instruction.

5. **Update `state.json`** — set `pendingReview.active: true` with a real question AND set `currentInstruction`:
   ```json
   "currentInstruction": {
     "type": "question",
     "text": "Answer the question in the sidebar before we move on.",
     "subtext": ""
   },
   "pendingReview": {
     "active": true,
     "filePath": "projects/my-quiz-app/quiz.js",
     "questionLevel": 1,
     "question": "Point to the line that checks whether the answer is correct.",
     "format": "text",
     "hints": [
       "Look for where two values are being compared...",
       "The === operator is doing the comparison. What are the two things on either side of it?",
       "Line 8: userAnswer === correctAnswer. The left side is what they typed; the right side is the stored correct answer."
     ],
     "hintsUsed": 0
   }
   ```

6. **Tell them** — "I've put a question in the sidebar — answer it before we move on."

---

## Marking Complete

Only mark an item complete when:
- They have explained what the code does in their own words, AND
- The code actually works (they've run it)

To mark complete:
1. Update `build-map.md` — change `- [ ]` to `- [x]` for the current item
2. Update `state.json` — increment `currentBuildMapItem`, set `pendingReview.active: false`, set `currentInstruction: null`
3. Award 100 XP — update `xp` in both `state.json` and `profile.json` (`.learner/students/[activeStudent]/profile.json`)
4. Check for level up — compare new XP to level thresholds in CLAUDE.md
5. Celebrate specifically — name the skill they just earned, not generic praise.
   - "That's your `checkAnswer` function working. You just wrote a function that takes input, makes a decision, and returns a result. That pattern — input → decision → output — is in almost every program ever written."

6. **Prompt a git commit** — "Before we start the next item, let's save this with git. Every time we finish a step, we commit — it's a habit every developer builds."
   - Suggest a commit message based on what they built: `git add -A && git commit -m "Add answer checking function"`
   - At Stage 0–2: briefly explain what each part does ("git add stages your files — it's saying 'include these'; git commit saves a snapshot with a label")
   - At Stage 3+: ask them to write their own commit message first, then give feedback on it
   - If it's their first commit ever: award the `first-commit` badge, update `profile.json.badges` and `state.json.badges`

---

## If This Was the Last Item

After step 6 (git commit), check `build-map.md` — if there are no remaining `- [ ]` items (excluding any items under a `## Level Up` section that was already appended), the student has completed their project.

### Project completion flow

**Step A — Celebrate the finish:**
Name what they built specifically. Not "great job" — describe what the project does, what they built, what it took.
> "That's it — [Project Name] is done. You started from zero and built a [quiz app / mobile tracker / whatever]. That took [N] sessions, and you wrote real code every step of the way."

**Step B — README prompt:**
> "Before anything else — let's write a README. Run `touch README.md` in your project folder, then open it and add three things: what the project does, how to run it, and one thing you learned building it. That's what every real project on GitHub has. Takes about 5 minutes."

Wait for them to confirm they've written it. Then award the `ship-it` badge — update `profile.json.badges` and `state.json.badges`.

**Step C — Final git commit:**
> "Now commit it: `git add -A && git commit -m 'Add README'` — your project is properly wrapped up."

**Step D — Badge gap summary:**

Read `profile.json.badges` and `profile.json.badgeProgress`. Compare against the full badge catalog in CLAUDE.md. Group unearned, stage-appropriate badges (those with `minStage ≤ currentStage`) by track. Present a short, encouraging summary:

> "Before we think about what's next — here's what your badge progress looks like. You've earned N badges so far. Looking at your gaps:
> - **JavaScript — Functions**: Return Master is 2/3 — you're close.
> - **Debugging**: Log Detective is 1/3 — a few more bugs to squash.
> - **Git & Workflow**: Branch Explorer is untouched — we haven't done branches yet.
>
> A new project that focuses on [gaps] would fill those in naturally."

Then offer: "Want to keep building this project, or does a new project sound good?"

**Step E — Level Up offer (if continuing):**
> "Ready to take this further? I can put together a Level Up plan — 3 to 5 improvements that'll make this project noticeably better. New features, better UI, something that makes it feel like a real app. Want to see what's possible?"

**If they say yes:**

1. Read `profile.json.weakAreas` and `profile.json.conceptsLearned`.
2. Generate 3–5 milestones that:
   - Each introduce one concept slightly beyond what was covered
   - Aim for visible, shareable results
   - Include at least one milestone that reinforces a weak area (if any)
3. Continue numbering from the last item (e.g. if the map had 6 items, start at 7).
4. Append to `build-map.md`:
   ```markdown

   ## Level Up

   - [ ] 7. [First extension milestone]
   - [ ] 8. [Second extension milestone]
   - [ ] 9. [Third extension milestone]
   ```
5. Update `state.json`: add `"projectPhase": "extension"`. The sidebar will pick up the new items automatically via the existing build map parser.
6. Say: "Here's your Level Up plan. The first item is [N]: [description]. Ready?"

**If they say no:**
> "That's completely fine. Use `/start` to begin something new whenever you're ready, or `/challenge` if you want a stretch exercise. Either way — you shipped a project. That's more than most people ever do."

---

## Always End With

Either a concrete task ("Now run it: `node quiz.js`") or a question ("What do you think would happen if the user typed the answer in capitals?"). Never end a `/next` session with a monologue.
