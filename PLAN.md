# Plan: Learner — VS Code Teaching Environment

## Context

A Claude Code-powered learning environment for a 15-year-old beginner. The student clones this repo, opens it in VS Code, and gets a pre-configured, distraction-free workspace with a custom sidebar. Claude Code handles all AI chat and code generation. A custom VS Code extension provides the structured learning UI (Build Map, Q&A panel, XP/progress).

**Core philosophy**: This teaches two things simultaneously:
1. **How to use Claude Code / LLMs** — prompting, reviewing generated output, knowing when to trust it
2. **Coding fundamentals** — enough to understand, modify, and extend what's generated

Claude WILL generate code when it makes sense. The learning happens in the review: after code is generated or written, the student is quizzed on what it does and why. The sidebar Q&A panel is the bridge between "Claude wrote this" and "the student understands it."

---

## How It Works (End-to-End)

1. Student opens the repo in VS Code → workspace settings apply (focused UI) + extension auto-installs
2. Student types `/start "I want to make a quiz app"` in Claude Code chat
3. Claude assesses their level, generates a Build Map, scaffolds `.learner/` state files
4. As Claude generates or edits code files, a `PostToolUse` hook fires → writes to `.learner/state.json`
5. The sidebar extension watches `.learner/state.json` → surfaces a code review card automatically
6. Student answers questions in the sidebar Q&A panel → answers written to `.learner/answer.json`
7. A `UserPromptSubmit` hook reads pending answers and injects context into the next Claude message
8. Claude evaluates the answer, awards XP, teaches any gaps, moves to the next item

---

## Repo Structure

```
/Users/rob/Work/Learner/
├── CLAUDE.md                          # Teaching contract — loaded by Claude every session
├── learner.code-workspace             # VS Code workspace: focused settings + extension recommendations
├── .vscode/
│   ├── settings.json                  # Focus mode: hide activity bar, minimap, breadcrumbs, etc.
│   ├── extensions.json                # Recommends: anthropic.claude-code + learner extension
│   └── tasks.json                     # runOn:folderOpen task to auto-install learner.vsix
├── .claude/
│   ├── settings.json                  # Hooks: PostToolUse (file write) + UserPromptSubmit (inject answers)
│   └── skills/
│       ├── start/SKILL.md             # /start — assess level, generate Build Map, scaffold state
│       ├── next/SKILL.md              # /next — introduce next Build Map item
│       ├── review/SKILL.md            # /review — trigger Q&A for current code
│       ├── explain/SKILL.md           # /explain — plain-English term or line explanation
│       ├── quiz/SKILL.md              # /quiz — standalone knowledge check
│       ├── hint/SKILL.md              # /hint — next hint level during review
│       ├── debug/SKILL.md             # /debug — guided debugging (diagnostic questions first)
│       ├── challenge/SKILL.md         # /challenge — stretch exercises
│       └── progress/SKILL.md         # /progress — show XP, level, badges
├── extension/                         # Source for the VS Code sidebar extension
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── extension.ts               # Activate, register WebviewViewProvider, file watcher
│   │   ├── LearnerViewProvider.ts     # WebviewView: sidebar HTML/JS
│   │   └── state.ts                   # Reads/writes .learner/*.json
│   └── webview/
│       ├── index.html
│       ├── main.js                    # Sidebar UI logic (vanilla JS, no bundler needed)
│       └── style.css
├── .learner/
│   └── .gitkeep                       # State files created at runtime by /start
└── README.md                          # Setup: clone → open in VS Code → enter API key in Claude Code
```

---

## What Each Layer Does

### `CLAUDE.md` — Teaching Contract

Loaded by Claude every session. Contains:

- **Role**: Claude is a coding teacher AND a code collaborator. It can and should generate code — but must always explain it and ensure the student understands it before moving on.
- **The two modes**:
  - *Guided writing*: For simple concepts, ask the student to write first. Explain first, then student attempts.
  - *Generate and review*: For complex or boilerplate code, Claude generates it, then immediately prompts a review ("Let me explain what I just wrote, then I'll quiz you on it").
- **The review mandate**: Every time Claude writes or edits a file, it must either (a) explain what changed and why, or (b) signal the sidebar to surface a Q&A card (by writing to `.learner/state.json`).
- **The "why" mandate**: Every pattern must come with a reason. Not just what it does — why it's structured that way.
- **LLM usage lessons**: Periodically, Claude teaches prompting skills: "Notice that I asked you to describe the feature before writing any code — that's a prompting technique called specification-first. Here's why it matters..."
- **Guardrails**:
  - Never move to the next Build Map item until the student can explain the current one
  - Never use "obviously", "simply", "just", or "easy"
  - One new concept per teaching message
  - After any generated code: always explain, always quiz
- **Analogy bank**: variable = labelled sticky note, function = recipe, loop = queue, git commit = save point, API = waiter, LLM = very well-read intern who needs clear instructions, etc.
- **Session startup**: Read `.learner/config.json` and `.learner/build-map.md`. Greet student by name, remind them where they left off.

---

### `.claude/settings.json` — Hooks

Two hooks that bridge Claude Code's actions to the sidebar:

**`PostToolUse` (on Write/Edit)**:
After Claude writes or edits any `.js` file in the workspace, a shell script:
1. Reads the file path and content
2. Writes a review-pending entry to `.learner/state.json`
3. The sidebar extension picks this up and surfaces a review card

**`UserPromptSubmit`**:
Before every student message is sent to Claude, a shell script:
1. Checks for `.learner/pending-answer.json`
2. If it exists, prepends its content to the message (e.g. "The student answered the review question: 'The variable stores the score so it doesn't reset on each loop.' Question was: [...]")
3. Deletes the pending answer file

This is the bridge: the student answers in the sidebar UI, which writes to a file, which gets injected into the next Claude message automatically.

---

### VS Code Workspace Settings (`.vscode/settings.json`)

Focus mode — hides everything irrelevant:

```json
{
  "workbench.activityBar.visible": false,
  "workbench.statusBar.visible": false,
  "editor.minimap.enabled": false,
  "breadcrumbs.enabled": false,
  "workbench.layoutControl.enabled": false,
  "workbench.editor.showTabs": "single",
  "editor.lineNumbers": "on",
  "editor.fontSize": 15,
  "editor.fontFamily": "monospace",
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay",
  "workbench.colorTheme": "Default Dark Modern"
}
```

The activity bar being hidden means the custom sidebar is accessible via Claude Code's panel (right side), which is where students will be spending most of their time anyway.

---

### `learner.code-workspace`

The file students open (instead of the folder directly). Sets the workspace name, settings, and extension recommendations in one file:

```json
{
  "folders": [{ "name": "My Project", "path": "." }],
  "settings": { /* same as .vscode/settings.json */ },
  "extensions": {
    "recommendations": ["anthropic.claude-code", "learner.learner-sidebar"]
  }
}
```

---

### Extension (`extension/`) — Sidebar

A minimal VS Code extension (TypeScript, no React bundler needed — vanilla JS webview):

**`extension.ts`**:
- Registers a `WebviewViewProvider` for the sidebar panel
- Creates a `FileSystemWatcher` on `.learner/state.json`
- On file change: reads state, calls `webviewView.webview.postMessage(state)` to update UI

**`LearnerViewProvider.ts` (WebviewView)**:
Sidebar panel shows 3 sections:

1. **Build Map** — checklist of milestones, current item highlighted
2. **Review Card** (appears when `state.json` has a pending question) — the question text, a text input or multiple-choice buttons, a Submit button, and a Hint button. Submit writes to `.learner/pending-answer.json`. This triggers the `UserPromptSubmit` hook on the next message.
3. **Progress** — XP bar, level title, badge icons

**Communication**:
- Extension → webview: `postMessage(state)` whenever state.json changes
- Webview → extension: `postMessage({ type: 'submitAnswer', answer })` when student submits
- Extension receives answer, writes `.learner/pending-answer.json`

**`state.ts`**:
- `readState()` — reads and parses `.learner/state.json`
- `writePendingAnswer(answer)` — writes `.learner/pending-answer.json`

---

### Skills (`.claude/skills/`)

Each skill is a SKILL.md with YAML frontmatter + markdown instructions to Claude. Key ones:

**`/start`**: Asks 3 conversational assessment questions. Based on answers, assigns a starting stage and picks an appropriate project decomposition. Generates the Build Map and writes `.learner/` state files. Teaches the student what those files are (LLM context is a concept taught early).

**`/next`**: Reads the current Build Map item. Decides whether this item should be student-written (simple concept) or Claude-generated-then-reviewed (complex/boilerplate). Follows the appropriate mode. Marks complete only after review.

**`/review`**: Reads the current file(s). Generates a `QAQuestion` object written to `state.json`. Levels 1–5 (What → How → Why → What-if → Design). Escalates based on correctness. Awards XP via state file update.

**`/explain`**: Takes a term or line number. Gives a plain-English explanation with analogy. Adds new terms to `.learner/glossary.md`. One concept at a time only.

**`/quiz`**: 3 questions from covered topics. Includes at least one question about LLM/prompting technique, not just code.

**`/debug`**: 3 diagnostic questions first. Then suggests `console.log()` placement. Never points to the bug directly.

**`/progress`**: Reads `progress.json`, formats a summary in chat.

---

### State Files (`.learner/`)

Created by `/start`, readable/educational for the student:

| File | Contents |
|---|---|
| `config.json` | Student name, stage (0–3), language (JS), project name |
| `build-map.md` | `- [ ]` / `- [x]` checklist of milestones |
| `progress.json` | XP, level, badges, streak, review history |
| `glossary.md` | Learned terms with plain-English definitions |
| `state.json` | Live state for sidebar: current item, pending Q&A question, XP |
| `pending-answer.json` | Temporary — written by sidebar, consumed by hook, then deleted |

---

### Curriculum Scope

The student is a girl. All of Claude's instructions, tone, and pronoun use should reflect this. Encouragement and analogies should not be gendered in a stereotyped way — just be natural and personal.

There are three activity types, mixed throughout every stage:

| Activity Type | When used | Example |
|---|---|---|
| **Student writes** | Simple, foundational concepts | "Write a function that checks if a guess is correct" |
| **Claude generates, student reviews** | Complex/boilerplate, or to show what's possible | Claude writes a file-read function, then quizzes her on every line |
| **Hands-on CLI/tool exercise** | Git, terminal commands, debugging | "Run `git log` and tell me what you see" |

No stage is purely one type. Every session should include at least one hands-on CLI or debug exercise.

---

**Stage 0 — Orientation**
- What is VS Code, what is a terminal, what is Claude Code
- What is an LLM: a tool you direct, not a magic oracle. First exercise: write a bad prompt, see a bad result, write a better one.
- CLI: `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cat`
- She types every command herself and explains what happened

**Stage 1 — Running Code**
- Running Node.js: `node file.js`, reading output, reading errors
- What a file extension means (`.js`, `.json`, `.md`)
- Deliberate error exercise: introduce a bug, read the stack trace, fix it
- Student writes: "Hello, world" → personalised greeting → simple user input with `readline`

**Stage 2 — Building Blocks** (introduced as the project needs them)
- Variables, strings, numbers, booleans — student writes
- Conditionals and comparisons — student writes (`=` vs `==` vs `===`)
- Loops — student writes; Claude generates a loop-heavy example, reviews together
- Functions — student writes simple ones; Claude generates a complex one with callback, reviews together
- Arrays and objects — Claude generates, reviews together; student modifies

**Stage 3 — Git & Collaboration**
- Why version control: the "undo button for your whole project" analogy
- Hands-on (every command typed by her): `git init`, `git status`, `git add`, `git commit -m`
- Branches: `git branch`, `git checkout -b`, `git merge`
- Reading `git log`, `git diff`
- Exercise: make a deliberate mistake on a branch, use `git checkout` to recover

**Stage 4 — Real Project Structure**
- Splitting code into multiple files, `require`/`import`
- `npm init`, `npm install`, reading `package.json`
- Claude generates a multi-file structure; she explains what each file does before running it
- Writing good prompts for larger features: specification-first technique

**Stage 5 — Data & Persistence**
- JSON: what it is, reading/writing files with `fs`
- SQLite basics: what a database is vs a file, tables, rows, columns
- Claude generates the database setup code; hands-on exercises: INSERT, SELECT, WHERE typed in a REPL or small script
- She writes the query logic herself after seeing the pattern

**Stage 6 — Debugging & Reading Code**
- Stack traces: how to read them top-to-bottom
- `console.log` debugging strategy
- Deliberate bug exercise: Claude hides a bug, she finds it using only `console.log` — no hints until she's tried
- Reading someone else's code: Claude generates an unfamiliar snippet, she explains it line by line before running it

**Stage 7** (extension): APIs, `fetch`, async/await, deployment basics.

**LLM / Claude Code skills woven throughout every stage**:
- How to write a specification before prompting (Stage 0)
- How to review generated code line by line before accepting (Stage 1+)
- When to trust output vs verify it (Stage 2+)
- How to iterate on a prompt when output is wrong (Stage 3+)
- Prompt patterns: role prompting, few-shot examples, asking for explanations (Stage 4+)
- Understanding Claude's limitations: it doesn't run the code, it can be confidently wrong (Stage 2+)

---

### XP & Levels

| Level | XP | Title |
|---|---|---|
| 1 | 0 | Debug Mode |
| 2 | 200 | Hello World |
| 3 | 500 | Function Author |
| 4 | 1000 | Loop Master |
| 5 | 2000 | Prompt Writer |
| 6 | 3500 | Git Committer |
| 7 | 5000 | Bug Hunter |
| 8 | 7500 | Code Reviewer |
| 9 | 10000 | Project Builder |
| 10 | 15000 | Shipping Engineer |

XP: Build Map item complete (100), review question first-try (25), hints used (10), challenge (75), found own bug (50 bonus), wrote a prompt that generated working code first-try (25 bonus).

Badges: First Commit, Bug Squasher, Explain-It-Back, The Librarian, Ship It, Prompt Perfectionist (generated code accepted without edits 3x), Challenger, Rubber Duck.

---

## Build Order

1. `CLAUDE.md` — teaching contract
2. `.vscode/settings.json` + `learner.code-workspace` — focus mode workspace
3. `.vscode/tasks.json` — auto-install task
4. `.claude/settings.json` — PostToolUse + UserPromptSubmit hooks
5. `.claude/skills/start/SKILL.md` — entry point skill
6. `.claude/skills/next/SKILL.md` + `review/SKILL.md` — core teaching loop
7. `.claude/skills/explain/SKILL.md`, `quiz/SKILL.md`, `hint/SKILL.md`, `debug/SKILL.md`, `challenge/SKILL.md`, `progress/SKILL.md`
8. `extension/package.json` + `extension/src/extension.ts` — extension scaffold
9. `extension/src/LearnerViewProvider.ts` — WebviewView with Build Map, Q&A, progress
10. `extension/src/state.ts` — state file helpers
11. `extension/webview/index.html` + `main.js` + `style.css` — sidebar UI
12. `.learner/.gitkeep`
13. `README.md`

---

## Verification

1. Open `learner.code-workspace` in VS Code → focus mode settings apply, extension auto-install task fires
2. Confirm sidebar panel appears (Build Map, Q&A, progress sections visible, all empty)
3. Open Claude Code chat, run `/start "I want to make a number guessing game"`
   - Assessment questions asked conversationally
   - Build Map generated, `.learner/` files created
   - Sidebar updates to show Build Map items
4. Run `/next` — Claude generates or guides writing of first item
5. Sidebar automatically shows a Review Card after Claude writes a file (PostToolUse hook fired)
6. Answer the review question in the sidebar → Submit → answer injected into next Claude message automatically
7. Claude evaluates answer, awards XP, sidebar XP bar updates
8. Run `/explain what is a function` — explanation in chat, glossary updated
9. Run `/quiz` — includes at least one prompting/LLM question alongside code questions
10. Confirm Claude explains generated code before moving on when `/next` uses generate-and-review mode
