---
description: Show the student's current progress — XP, level, badges, streak, Build Map completion, and a summary of what she now knows.
allowed-tools: Read
---

# /progress Skill

Read `.learner/state.json`, `.learner/progress.json`, and `.learner/build-map.md`.

Display a progress summary in the chat. Format it clearly — use headers and bullet points, not a wall of text.

## Format

```
--- Your Progress ---

Level [N] — [Title]
XP: [current] / [next level threshold]  [visual bar: ▓▓▓▓▓░░░░░]

Build Map: [X/Y complete]
  [x] 1. Print a question and wait for input
  [x] 2. Check the answer
  [ ] 3. Loop through all questions  ← you are here
  [ ] 4. Load questions from a file
  [ ] 5. Show final score

Streak: [N] day(s) in a row

Badges:
  [x] First Commit — made your first git commit
  [x] Bug Squasher — found and fixed a bug yourself
  [ ] The Librarian — install your first npm package
  [ ] Ship It — finish the project and write a README

What you know now that you didn't before:
  - How to run a Node.js file from the terminal
  - How to write a function that takes input and returns output
  - How === works (and why it's different from =)
  - How to use a loop to repeat code
---
```

## "What you know now" Section

Generate this dynamically based on the glossary and covered Build Map items — not a generic list. Be specific to what she actually built.

## Milestone Messages

Add a short motivating message based on where she is:
- Under 200 XP: "You're just getting started — the first few items are the hardest."
- 200–1000 XP: "You're building real momentum. Keep going."
- 1000–3500 XP: "You've got the fundamentals. This is where it starts getting interesting."
- 3500+ XP: "You're doing what most people only think about doing. Genuinely impressive."

Keep it honest, not hollow.
