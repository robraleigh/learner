---
description: Start a new learning project. Runs a skill assessment, collaboratively builds a Build Map, and scaffolds all .learner/ state files. Run this once per project.
---

# /start Skill

The student has provided a project idea. Your job is to assess their level, pick the right stack, decompose the idea into a Build Map, and get everything set up so they can start building.

## Step 1 — Skill Assessment (conversational, not a test)

Ask these three questions one at a time. Wait for their answer before asking the next one.

1. "Have you written any code before? Anything counts — HTML, Python at school, Scratch, even a tiny bit."
2. "When you picture [their project idea] working, walk me through what using it actually looks like. Pretend I've never seen one."
3. "Is there anything about computers that already makes sense to you — like, is there anything you've noticed or figured out on your own?"

Based on their answers, assign a starting stage:
- No coding experience at all → Stage 0
- Heard of variables, maybe done a tiny bit → Stage 1
- Written some code, understands basic concepts → Stage 2

## Step 1.5 — Badge gap check (returning students only)

If `profile.json` already exists, read `profile.json.badges`, `profile.json.badgeProgress`, and `profile.json.overallStage` before building the map.

Identify unearned badges where `minStage ≤ overallStage` — these are gaps within reach. Group them by track. Use this to inform (not dictate) the Build Map:

- If the student has no CSS badges and is at Stage 2+, lean toward a web project that naturally involves CSS.
- If Functions or Objects badges are missing, include Build Map items that require writing functions or objects from scratch.
- If Data & Storage badges are missing and they're at Stage 4+, suggest a project that involves reading or writing data.
- If DevOps/Deployment badges are untouched and they're at Stage 4+, include a milestone for npm scripts or environment variables.

Do not tell the student "you need to earn badges" — just shape the project scope around what they haven't practised yet. When presenting the Build Map, you can say:

> "I've shaped this around things you haven't tackled yet — there are some gaps in your Functions and Debugging skills that this project will naturally fill in."

---

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

## Step 2.5 — Stack Selection

Before creating any files, determine the project type and choose the right stack.

Ask: "Is this mainly something you'd use in a browser, on a phone, or just in the terminal?"

Then choose based on their answer and their stage:

| Project type | Stage | Stack |
|---|---|---|
| CLI (terminal tool, text game, script) | Any | Node.js only |
| Web (app, dashboard, quiz UI, website) | 0–1 | Plain HTML/CSS/JS |
| Web | 2–3 | Vite + vanilla JS |
| Web | 4+ | React + Vite |
| Mobile ("I want it on my phone") | Any | React Native + Expo |

Tell them what you're choosing and why, briefly:
- "Since this is a web app and you're newer to coding, we'll start with plain HTML and JavaScript — no extra tools yet. Once you've got the basics, we can add a proper dev setup."
- "Since you want this on your phone, we'll use React Native and Expo — it lets you see changes instantly on a simulator."

If it's a web or mobile project, also ask: "Do you have a rough idea what you want it to look like? A sketch or screenshot of something similar would help a lot — it makes it much easier to write CSS that actually looks right."

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

Once the project directory exists and `git init` is done, create these files.

All project state files go in `.learner/students/[name]/projects/[slug]/` — one folder per project, so multiple projects can coexist without overwriting each other.

Also read `.learner/active.json` to get `activeStudent`. Use that name throughout.

**.learner/students/[name]/projects/[slug]/config.json**
```json
{
  "studentName": "[their name, or 'you' if they didn't share it]",
  "stage": [0, 1, or 2],
  "language": "javascript",
  "projectType": "[cli | web | mobile]",
  "stack": "[node | html-css-js | vite-vanilla | vite-react | expo]",
  "projectName": "[their project name]",
  "projectDir": "projects/[slug]",
  "startDate": "[today's date]"
}
```

**.learner/students/[name]/projects/[slug]/build-map.md**
```markdown
# Build Map: [Project Name]

- [ ] 1. [First milestone]
- [ ] 2. [Second milestone]
...
```

**.learner/students/[name]/projects/[slug]/progress.json**
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

**.learner/students/[name]/projects/[slug]/state.json**
```json
{
  "studentName": "[their name]",
  "currentStage": [stage],
  "currentBuildMapItem": 1,
  "currentInstruction": null,
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
  "badgeProgress": {},
  "streak": 1,
  "lastSession": "[today's date]"
}
```

**.learner/students/[name]/projects/[slug]/glossary.md**
```markdown
# My Coding Glossary

Terms I've learned, in plain English.

---
```

**Student profile** — check if `.learner/students/[name]/profile.json` already exists.
- If it does NOT exist (first project for this student), create it:
```json
{
  "studentName": "[their name]",
  "overallStage": [stage],
  "startDate": "[today's date]",
  "lastSession": "[today's date]",
  "activeProject": "[slug]",
  "projectsCompleted": [],
  "conceptsLearned": [],
  "weakAreas": [],
  "strengths": [],
  "totalXP": 0,
  "level": 1,
  "levelTitle": "Debug Mode",
  "badges": []
}
```
- If it already exists (returning student), update `activeProject` to `[slug]` and `lastSession` to today.

Also create `.learner/students/[name]/notes.md` if it doesn't exist:
```markdown
# Teaching Notes: [name]

## What clicks

## Areas to reinforce

## Per-project

```

After creating the project state files, update (or create) **.learner/active.json**:
```json
{ "activeStudent": "[name]", "activeProject": "[slug]" }
```

This tells the sidebar and hooks which student and project is currently active.

---

## Step 5 — Introduce Item 1

After the files are created, say something like:
"Everything's set up. The sidebar should show your Build Map now. Your project folder is at `projects/[slug]/` — that's where all your code will live. Let's start with item 1."

Explain the folder structure:
"There are two places that matter. The `.learner/` folder holds your progress — XP, Build Map, notes. Your actual code goes in `projects/[slug]/`. That code folder is its own git repository, which means when you're done, you can put it on GitHub as your own project. Those files are yours."

Then begin Item 1 using the teach-first protocol from CLAUDE.md — explain the concept before asking them to write anything.
