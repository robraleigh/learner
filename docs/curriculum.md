# Learner Curriculum Guide

This document describes what is taught at each stage, what CLI tools are introduced, which stacks become available, and what a typical project looks like at that level.

Use this as a reference when planning a new project, explaining progress to parents, or deciding what level to start a student at.

---

## Stage 0 — Orientation

**Goal**: Get comfortable with the tools before writing any real code.

### What they learn
- What VS Code is and how to navigate it
- What a terminal/command line is and why developers use it
- What Claude Code is (an AI that helps you build things — but can be wrong)
- What an LLM is: "a very well-read intern who needs clear instructions"
- How to write a prompt, see a bad result, and improve it

### CLI tools introduced
| Command | What it does |
|---|---|
| `pwd` | Print working directory — where am I? |
| `ls` | List files in the current folder |
| `cd folder` | Change directory (move into a folder) |
| `mkdir name` | Make a new folder |
| `touch file.js` | Create an empty file |
| `cat file.js` | Print a file's contents to the terminal |
| `clear` | Clear the terminal screen |

### First milestone
Write a bad prompt → observe the bad result → improve the prompt → observe the better result.

### Stack
None — no code yet. Focus is on the environment.

---

## Stage 1 — Running Code

**Goal**: Write a line of code, run it, read the output.

### What they learn
- What a JavaScript file is
- How to run a file with Node.js
- What a stack trace is and how to read it (breadcrumb trail)
- How to print output with `console.log`
- How to get input from the user with `readline`
- Hello World → personalised greeting → user input

### CLI tools introduced
| Command | What it does |
|---|---|
| `node file.js` | Run a JavaScript file |
| `↑` (up arrow) | Repeat the last command |
| Reading error output | Identify the file and line number where something went wrong |

### First project milestone
```
[ ] Print "Hello, world!" to the terminal
[ ] Ask the user their name and print a personalised greeting
[ ] Ask the user a question and store their answer
```

### Stack
Node.js only. No browser yet.

---

## Stage 2 — Building Blocks

**Goal**: Write code that makes decisions and repeats actions.

### What they learn
- Variables: `const` vs `let` (permanent label vs swappable label)
- Conditionals: `if/else`, `===` vs `==`
- Loops: `for`, `while` (queue at a ticket machine)
- Functions: parameters, return values (recipe → what comes out of the oven)
- Arrays: numbered shopping lists
- Objects: forms with labelled fields
- Mix of student-written and generate-and-review

### CLI tools introduced
| Command | What it does |
|---|---|
| `node` (no file) | Open the Node REPL — type JS directly and see results instantly |
| `Ctrl+C` | Exit the REPL or stop a running program |
| `Ctrl+D` | Exit the REPL cleanly |

### Typical project milestones
```
[ ] Store the user's score in a variable and update it
[ ] Check if the answer is correct using if/else
[ ] Loop through all quiz questions automatically
[ ] Put the checking logic in a function
[ ] Store questions in an array
```

### Stack
Node.js only for CLI projects. For web projects: plain HTML/CSS/JS (no tooling).

---

## Stage 3 — Git

**Goal**: Never lose work again. Build the save-point habit.

### What they learn
- Why version control exists ("what if you could rewind to any save point?")
- `git init`, `git status`, `git add`, `git commit`
- Reading `git log` and `git diff`
- Branches: create, commit, merge, recover from mistakes
- **From this stage on**: every Build Map item ends with a git commit

### CLI tools introduced
| Command | What it does |
|---|---|
| `git init` | Start a new git repository |
| `git status` | See what's changed since the last commit |
| `git add -A` | Stage all changes |
| `git add file.js` | Stage a specific file |
| `git commit -m "message"` | Save a snapshot with a label |
| `git log` | See the history of commits |
| `git diff` | See exactly what changed |
| `git branch name` | Create a new branch (parallel timeline) |
| `git checkout -b name` | Create and switch to a new branch |
| `git checkout main` | Switch back to the main branch |
| `git merge name` | Bring changes from another branch in |

### Badges unlocked
- `first-commit` — awarded on first ever `git commit`

---

## Stage 4 — Project Structure

**Goal**: Write code that lives in multiple files and uses other people's libraries.

### What they learn
- Why one big file gets messy (and how to split it up)
- `require` / `import` — how files talk to each other
- `npm init` — what `package.json` is and why it exists
- `npm install` — borrowing a tool from a neighbour
- `package.json` — the project's identity card
- How to read a library's documentation
- Specification-first prompting: describe what you want before asking Claude to write it

### CLI tools introduced
| Command | What it does |
|---|---|
| `npm init -y` | Create a package.json with defaults |
| `npm install package-name` | Install a library |
| `npm run script-name` | Run a script defined in package.json |
| `npx command` | Run a package without installing it globally |
| `npm create vite@latest` | Scaffold a new Vite project |
| `npm run dev` | Start the Vite dev server with hot reload |

### Stack upgrade
- **Web projects**: move from plain HTML to **Vite + vanilla JS** (if Stage 2–3) or **React + Vite** (if Stage 4+)
- **Mobile projects**: **React Native + Expo** at any stage

### Badges unlocked
- `librarian` — awarded on first `npm install`

---

## Stage 5 — Data & Persistence

**Goal**: Make data survive beyond the current session.

### What they learn
- JSON as a data format (structured label-and-value system, like a form filled in)
- Reading and writing files with Node's `fs` module
- SQLite: what a database is (spreadsheet that never goes away), how to query it
- Writing INSERT, SELECT, WHERE statements (student writes queries after seeing the pattern)
- The difference between data in memory vs data on disk

### CLI tools introduced
| Command | What it does |
|---|---|
| `sqlite3 database.db` | Open an SQLite database in the terminal |
| `.tables` | List all tables in the database |
| `.schema table` | Show a table's structure |
| `.quit` | Exit sqlite3 |

---

## Stage 6 — Debugging

**Goal**: Find and fix bugs systematically, not by guessing.

### What they learn
- Reading a stack trace properly (file, line, error type, message)
- `console.log` strategy: "cut a window in the wall to see inside"
- How to isolate a bug (binary search your own code)
- Reading unfamiliar code — how to approach someone else's file
- Deliberate bug exercises: intentionally broken code to find and fix
- The rubber duck technique

### CLI tools introduced
| Command | What it does |
|---|---|
| Reading stack traces | Identify the exact file and line that threw the error |
| `console.log` | Print values at strategic points to see what's happening |

### Badges unlocked
- `bug-squasher` — find and fix a bug they spotted themselves
- `rubber-duck` — used `/debug` and found the bug before Claude pointed to it

---

## Stage 7 (Extension) — APIs & Deployment

**Goal**: Connect your project to the real world.

### What they learn
- What an API is (waiter: you ask, it goes to the kitchen, brings back what you need)
- `fetch`: making an HTTP request from JavaScript
- `async/await`: why some code has to wait (and how to make it wait gracefully)
- Environment variables: keeping secrets out of code
- Deployment: putting your project on the internet

### CLI tools introduced
| Command | What it does |
|---|---|
| `curl https://...` | Make an HTTP request from the terminal (test APIs directly) |
| `curl -s url \| python3 -m json.tool` | Pretty-print JSON from an API |
| Setting env vars | `export API_KEY=...` or using a `.env` file |
| Deployment CLI | Varies by platform (Vercel, Netlify, Railway, Fly.io) |

---

## Stack Reference

| Project type | Stage | Stack | Setup command |
|---|---|---|---|
| CLI / Node | Any | Node.js | `touch index.js` |
| Web | 0–1 | Plain HTML/CSS/JS | `touch index.html` |
| Web | 2–3 | Vite + vanilla | `npm create vite@latest` (type: vanilla) |
| Web | 4+ | React + Vite | `npm create vite@latest` (type: react) |
| Mobile | Any | React Native + Expo | `npx create-expo-app` |

### Mobile testing
- Start: `npx expo start`
- iOS simulator: press `i`
- Android simulator: press `a`
- Physical device: scan QR code with Expo Go app

---

## XP & Levels

| Level | XP needed | Title |
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

### How XP is earned
- Complete a Build Map item: **100 XP**
- Answer a review question correctly (first try): **25 XP**
- Answer a review question (with hints): **10 XP**
- Complete a challenge exercise: **75 XP**
- Find your own bug before Claude pointed to it: **+50 XP bonus**
- Your prompt generated working code first try: **+25 XP bonus**

---

## Badges

| Badge | How to earn it |
|---|---|
| First Commit | Make your first `git commit` |
| Bug Squasher | Find and fix a bug yourself (before Claude points to it) |
| Explain-It-Back | Accurately explain a concept back in your own words, 3 times in a row |
| The Librarian | Run your first `npm install` for a real package |
| Ship It | Complete the Build Map and write a README |
| Prompt Perfectionist | Claude-generated code accepted without edits, 3 times |
| Challenger | Complete 3 challenge exercises |
| Rubber Duck | Used `/debug` and found the bug before Claude pointed to it |
