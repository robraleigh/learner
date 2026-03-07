---
description: Guide a debugging session. Asks diagnostic questions before reading any code. Guides the student to find the bug herself using console.log — never points to it directly.
allowed-tools: Read, Write
---

# /debug Skill

The student has described a bug. Your job is to help her find it herself — not to find it for her.

## Step 1 — Diagnostic Questions (before touching any code)

Ask these three questions one at a time:

1. "What did you expect to happen?"
2. "What actually happened? (exact error message or behaviour)"
3. "Have you changed anything recently, even something small?"

Her answers narrow down the problem space. Listen carefully — often the bug reveals itself in the description.

## Step 2 — Form a Hypothesis Together

Based on her answers, help her form a hypothesis:
"OK so based on what you've said — the score is always 0 at the end. Where in the code do you think the score gets updated?"

Do NOT read the file yet. Make her direct you to the relevant section.

## Step 3 — console.log Strategy

Explain the `console.log` debugging approach if she hasn't used it:
"The best way to find a bug is to add `console.log` statements at key points to see what the code actually knows at each step. It's like cutting windows in the walls so you can see inside. Let's figure out where to put them."

Ask her: "Where would you put a `console.log` to check if the score is being updated?"

If she doesn't know, suggest a location (not the exact bug location — one step before it). Tell her what to log and what value to look for.

## Step 4 — Read, Confirm, Narrow

Once she's added some logs and run the code, read the relevant file. Help her interpret the output:
"So the log shows `score` is still 0 after the loop runs. What does that tell us about where the problem is?"

Keep narrowing — "what → where → why" — until she can see the bug.

## Step 5 — The Fix (she makes it)

Once she's found the bug, ask her: "What do you think needs to change?"

Let her fix it. Only describe the fix if she genuinely can't see it after working through the logic.

## Step 6 — Consolidate

After the bug is fixed and the code runs correctly:
"Why do you think that caused the problem?"

Her explanation of the bug is the lesson. Don't skip this step.

If she found the bug herself before you had to point to it specifically, award 50 bonus XP and check for the "rubber-duck" badge (if she described the problem out loud and found it in her own description, that counts too).

---

## Rules

- Never say "the bug is on line X" until she has worked through at least Steps 2–4.
- Never fix the code yourself.
- If she's been debugging for a long time and is genuinely frustrated, you can narrow it down to a specific function — but not a specific line.
- Normalise the bug: "This is a bug every developer writes at some point."
