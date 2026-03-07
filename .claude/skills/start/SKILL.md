---
description: Start a new learning project. Runs a skill assessment, collaboratively builds a Build Map, and scaffolds all .learner/ state files. Run this once per project.
allowed-tools: Read, Write
---

# /start Skill

The student has provided a project idea. Your job is to assess her level, decompose the idea into a Build Map, and get everything set up so she can start building.

## Step 1 — Skill Assessment (conversational, not a test)

Ask these three questions one at a time. Wait for her answer before asking the next one.

1. "Have you written any code before? Anything counts — HTML, Python at school, Scratch, even a tiny bit."
2. "When you picture [her project idea] working, walk me through what using it actually looks like. Pretend I've never seen one."
3. "Is there anything about computers that already makes sense to you — like, is there anything you've noticed or figured out on your own?"

Based on her answers, assign a starting stage:
- No coding experience at all → Stage 0
- Heard of variables, maybe done a tiny bit → Stage 1
- Written some code, understands basic concepts → Stage 2

## Step 2 — Build Map

Do NOT start writing code. Instead, break her idea into 6–10 small, independent, buildable milestones. Each milestone should:
- Introduce at most one new concept
- Be achievable in a single session
- Build clearly on the previous one
- Start with something she can do in 10 minutes

Show her the Build Map as a numbered list. Then ask: "Does this match what you had in your head? Is there anything missing or that surprises you?" Adjust based on her feedback.

Example for a quiz app:
```
Build Map: Football Quiz
[ ] 1. Print a question and wait for her to type an answer
[ ] 2. Check if the answer is right and print "Correct!" or "Try again"
[ ] 3. Ask all 5 questions in a loop and track her score
[ ] 4. Load questions from a file instead of writing them in the code
[ ] 5. Show her final score at the end with a message
[ ] 6. Let her pick a quiz category at the start
```

## Step 3 — Scaffold State Files

Once the Build Map is confirmed, create these files:

**.learner/config.json**
```json
{
  "studentName": "[her name or 'you' if she didn't share it]",
  "stage": [0, 1, or 2],
  "language": "javascript",
  "projectName": "[her project name]",
  "startDate": "[today's date]"
}
```

**.learner/build-map.md**
```markdown
# Build Map: [Project Name]

- [ ] 1. [First milestone]
- [ ] 2. [Second milestone]
...
```

**.learner/progress.json**
```json
{
  "xp": 0,
  "level": 1,
  "levelTitle": "Debug Mode",
  "badges": [],
  "streak": 0,
  "lastSession": "[today's date]",
  "reviewHistory": []
}
```

**.learner/state.json**
```json
{
  "studentName": "[her name]",
  "currentStage": [stage],
  "currentBuildMapItem": 1,
  "pendingReview": {
    "active": false,
    "filePath": "",
    "questionLevel": 1,
    "question": "",
    "format": "text",
    "hints": [],
    "hintsUsed": 0
  },
  "xp": 0,
  "level": 1,
  "levelTitle": "Debug Mode",
  "badges": [],
  "streak": 1,
  "lastSession": "[today's date]"
}
```

**.learner/glossary.md**
```markdown
# My Coding Glossary

Terms I've learned, in plain English.

---
```

## Step 4 — Introduce Item 1

After the files are created, say something like:
"Everything's set up. The sidebar should show your Build Map now. Let's start with item 1."

Then begin Item 1 using the teach-first protocol from CLAUDE.md — explain the concept before asking her to write anything.

Also take a moment to explain what the `.learner/` folder is:
"I've created a `.learner/` folder. It stores your progress — things like your XP, your Build Map, and a glossary of everything you've learned. You can open those files any time; they're just plain text. Reading your own progress data is actually a good way to get comfortable with JSON, which we'll learn about later."
