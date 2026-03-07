# Learner

An interactive coding environment for beginners, built on Claude Code and VS Code. Designed for a student who has a project idea and wants to build it — while actually learning how the code works.

## What It Does

- **Custom sidebar** — tracks your Build Map, shows active review questions, displays XP and badges
- **Guided teaching** — Claude explains concepts before asking you to write code, and reviews what you build
- **Structured code review** — after writing or generating code, answer questions about it in the sidebar to earn XP
- **Covers**: CLI basics, JavaScript, git, project structure, SQLite, debugging, and how to use an LLM effectively

## Setup

You need:
- [VS Code](https://code.visualstudio.com)
- [Node.js LTS](https://nodejs.org)
- A Claude.ai account (Pro or Max) **or** an Anthropic API key

### 1. Clone the repo

```bash
git clone <this-repo-url>
cd Learner
```

### 2. Run setup

```bash
bash setup.sh
```

This installs and builds the sidebar extension. You only need to do this once.

### 3. Install the Claude Code extension

In VS Code, install the **Claude Code** extension (publisher: `anthropic`).

If you're using a personal Claude.ai account for just this project, create `.claude/settings.local.json`:

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "your-key-here"
  }
}
```

This file is gitignored and stays on your machine only.

### 4. Open the workspace

Open `learner.code-workspace` in VS Code (not just the folder). This activates the focused settings and the sidebar.

### 5. Start learning

Open the Claude Code chat and type:

```
/start "I want to make a quiz app about football"
```

Claude will ask you a few questions, build a plan together with you, and guide you through building it step by step.

---

## Slash Commands

| Command | What it does |
|---|---|
| `/start "idea"` | Begin a new project — assessment, Build Map, setup |
| `/next` | Move to the next Build Map item |
| `/review` | Trigger a code review with escalating questions |
| `/explain [term or line N]` | Plain-English explanation of any concept |
| `/quiz` | 3-question knowledge check (includes prompting skills) |
| `/hint` | Get the next hint during an active review |
| `/debug [description]` | Guided debugging — Claude won't just fix it for you |
| `/challenge` | Optional stretch exercise for extra XP |
| `/progress` | See your XP, level, badges, and streak |

---

## How Progress Works

- **XP** is earned by completing Build Map items, answering review questions, and debugging
- **Levels** go from "Debug Mode" (Lv 1) to "Shipping Engineer" (Lv 10)
- **Badges** are earned for specific milestones (first commit, first npm install, etc.)
- **Streak** tracks how many days in a row you've coded

Your progress is stored in `.learner/` — plain JSON files you can read and learn from.

---

## Project Structure

```
.claude/
  CLAUDE.md              # Claude's teaching instructions (read automatically)
  settings.json          # Hooks that connect Claude's actions to the sidebar
  hooks/                 # Shell scripts for PostToolUse and UserPromptSubmit
  skills/                # Slash command definitions

.vscode/
  settings.json          # Focus mode workspace settings

extension/               # Source for the sidebar VS Code extension
  src/                   # TypeScript source
  webview/               # Sidebar HTML/CSS/JS

.learner/                # Your progress data (created after /start)
  config.json
  build-map.md
  progress.json
  glossary.md
  state.json
```
