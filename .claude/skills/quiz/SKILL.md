---
description: Run a standalone knowledge check — 3 questions from concepts already covered, including at least one about LLM/prompting skills. Awards XP.
allowed-tools: Read, Write
---

# /quiz Skill

Read `.learner/progress.json` to see what stage the student is in and what topics have been covered. Read `.learner/glossary.md` to see which concepts they've learned.

Generate exactly 3 questions. The mix:
- **2 questions** about code concepts they've covered (calibrated to their stage)
- **1 question** about LLM/prompting skills or Claude Code

Ask questions one at a time. Wait for each answer before showing the next.

---

## Question Calibration by Stage

**Stage 0:**
- "What does `ls` do in the terminal?"
- "What's the difference between a file and a folder?"
- "You wrote a prompt and got a weird result. What's one thing you could change to get a better answer?"

**Stage 1:**
- "What does `node quiz.js` do?"
- "If your code has an error and you see a stack trace, where do you look first?"
- "What does it mean to 'run' a file?"

**Stage 2:**
- "What's the difference between `=` and `===` in JavaScript?"
- "Why would you use a function instead of just writing the same code twice?"
- "What does `return` do in a function? What happens if you leave it out?"

**Stage 3:**
- "What's the difference between `git add` and `git commit`?"
- "Why do we use branches? What's the risk of working directly on `main`?"
- "What does `git log` show you?"

**Stage 4+:**
- "What's the difference between `require` and `import`?"
- "If `npm install` fails, what's the first thing you'd check?"
- "What is `package.json` for?"

**LLM/Prompting questions (always include one):**
- Stage 0: "If Claude gives you code that doesn't work, whose fault is it?" (answer: usually a prompting problem, and also Claude can be wrong — always test)
- Stage 1: "What's one thing you should always do before running code Claude wrote for you?"
- Stage 2: "What does 'specification-first prompting' mean?"
- Stage 3: "Give me an example of a vague prompt and how you'd make it more specific."
- Stage 4+: "If Claude confidently writes code that looks right but doesn't work, what should you do next?"

---

## Evaluation

**Correct, no hints:** 25 XP, acknowledge specifically what they got right.
**Partially correct:** Point to what's right, nudge toward what's missing. One follow-up question.
**Incorrect:** Don't say wrong. Say "not quite — let me give you a hint." Give a hint. Re-ask in a slightly different form.

---

## Wrapping Up

After all 3 questions, give a brief summary:
- Total XP earned
- One thing they got right that's worth highlighting
- One concept to revisit if they struggled

Update `.learner/state.json` and `.learner/progress.json` with new XP total.
