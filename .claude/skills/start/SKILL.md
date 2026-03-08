---
description: Start a new learning project. Runs a skill assessment, collaboratively builds a Build Map, and scaffolds all .learner/ state files. Run this once per project.
allowed-tools: Read, Write
---

# /start Skill

The student has provided a project idea. Your job is to assess their level, decompose the idea into a Build Map, and get everything set up so they can start building.

## Step 1 — Skill Assessment (conversational, not a test)

Ask these three questions one at a time. Wait for their answer before asking the next one.

1. "Have you written any code before? Anything counts — HTML, Python at school, Scratch, even a tiny bit."
2. "When you picture [their project idea] working, walk me through what using it actually looks like. Pretend I've never seen one."
3. "Is there anything about computers that already makes sense to you — like, is there anything you've noticed or figured out on your own?"

Based on their answers, assign a starting stage:
- No coding experience at all → Stage 0
- Heard of variables, maybe done a tiny bit → Stage 1
- Written some code, understands basic concepts → Stage 2

## Step 2 — Build Map

Do NOT start writing code. Instead, break their idea into 6–10 small, independent, buildable milestones. Each milestone should:
- Introduce at most one new concept
- Be achievable in a single session
- Build clearly on the previous one
- Start with something they can do in 10 minutes

Show them the Build Map as a numbered list. Then ask: "Does this match what you had in your head? Is there anything missing or that surprises you?" Adjust based on their feedback.

Example for a quiz app:
```
Build Map: Football Quiz
[ ] 1. Print a question and wait for the player to type an answer
[ ] 2. Check if the answer is right and print "Correct!" or "Try again"
[ ] 3. Ask all 5 questions in a loop and track the score
[ ] 4. Load questions from a file instead of writing them in the code
[ ] 5. Show the final score at the end with a message
[ ] 6. Let the player pick a quiz category at the start
```

## Step 3 — Create the Project Directory

Before creating state files, set up the project folder.

1. Slugify the project name: lowercase, spaces → hyphens, remove special characters.
   - "My Football Quiz" → `my-football-quiz`
   - "Pet Tracker App" → `pet-tracker-app`

2. Create the directory: `projects/[slug]/`

3. Teach the first CLI exercise — tell them:
   "Your project folder is created. Now let's initialise a git repository inside it — this is your first terminal command. Open the terminal and run these two commands:"
   ```
   cd projects/[slug]
   git init
   ```
   Wait for them to confirm they've done it. If they get an error, help them troubleshoot. This counts as their first CLI exercise.

4. Set `projectDir` to `"projects/[slug]"` — you'll use this in every subsequent step when writing code files.

---

## Step 4 — Scaffold State Files

Once the project directory exists and `git init` is done, create these files:

**.learner/config.json**
```json
{
  "studentName": "[their name, or 'you' if they didn't share it]",
  "stage": [0, 1, or 2],
  "language": "javascript",
  "projectName": "[their project name]",
  "projectDir": "projects/[slug]",
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
  "studentName": "[their name]",
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

## Step 5 — Introduce Item 1

After the files are created, say something like:
"Everything's set up. The sidebar should show your Build Map now. Your project folder is at `projects/[slug]/` — that's where all your code will live. Let's start with item 1."

Then begin Item 1 using the teach-first protocol from CLAUDE.md — explain the concept before asking them to write anything.

Also take a moment to explain the folder structure:
"There are two folders that matter here. The `.learner/` folder holds your progress — XP, Build Map, glossary. Your actual code goes in `projects/[slug]/`. That code folder is its own git repository, which means when you're done, you can put it on GitHub as your own project. Those files are yours."
