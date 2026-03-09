---
description: Switch to a different student user, or create a new one. /learner <name> switches directly; /learner without a name shows all students and lets you pick.
---

# /learner Skill

The user wants to switch to a different student, or see who's available.

Args (if provided): `$ARGUMENTS` — a student name, or empty.

## Step 1 — Discover Existing Students

List all subdirectories under `.learner/students/`. A valid student directory is one that contains a `profile.json`.

Collect:
- Their `studentName` from `profile.json`
- Their `activeProject` from `profile.json`
- Their `totalXP` and `level` from `profile.json`
- Their `lastSession` from `profile.json`

## Step 2 — Branch on Arguments

### If a name was provided (`$ARGUMENTS` is not empty):

1. Slugify the provided name: lowercase, trim whitespace.
2. Check if `.learner/students/[slug]/profile.json` exists.
   - **If it exists** → jump to Step 4 (Switch to that student).
   - **If it does NOT exist** → jump to Step 3 (Create new student).

### If no name was provided (`$ARGUMENTS` is empty):

Display the student list:

```
Students:

1. Alice — Level 3 · 450 XP · last session 2026-03-01 (active project: football-quiz)
2. Jordan — Level 1 · 50 XP · last session 2026-02-15 (active project: pet-tracker)
N. Create a new student

Who should I switch to? (type a number or a name)
```

If no valid student directories exist yet:
```
No students found yet. Type a name to create the first one, or run /start to begin.
```

Wait for their response, then:
- If they pick a number or a name that matches an existing student → Step 4.
- If they pick "Create a new student" or type a name that doesn't exist → Step 3.

## Step 3 — Create a New Student

Ask: "What's their name?" (skip if the name was already provided via args or their response).

Then:
1. Slugify the name for the directory (lowercase, spaces → hyphens, strip special chars).
2. Create `.learner/students/[slug]/` directory (by writing the profile file).
3. Create `.learner/students/[slug]/profile.json`:
```json
{
  "studentName": "[name as they typed it]",
  "overallStage": 0,
  "startDate": "[today's date]",
  "lastSession": "[today's date]",
  "activeProject": null,
  "projectsCompleted": [],
  "conceptsLearned": [],
  "weakAreas": [],
  "strengths": [],
  "totalXP": 0,
  "level": 1,
  "levelTitle": "Debug Mode",
  "badges": [],
  "badgeProgress": {}
}
```
4. Create `.learner/students/[slug]/notes.md`:
```markdown
# Teaching Notes: [name]

## What clicks

## Areas to reinforce

## Per-project

```
5. Update `.learner/active.json`:
```json
{ "activeStudent": "[slug]", "activeProject": null }
```
6. Say:
   "New student [name] created. They don't have a project yet — use `/start` to kick off their first one."

Stop here. Don't proceed to Step 4.

## Step 4 — Switch to Existing Student

1. Read `.learner/students/[slug]/profile.json` to get their `activeProject`.
2. Write `.learner/active.json`:
```json
{ "activeStudent": "[slug]", "activeProject": "[activeProject or null]" }
```
3. Read `profile.json` again to get their name, level, XP, and active project.

If they have an active project:
- Read `.learner/students/[slug]/projects/[activeProject]/config.json` for `projectName`.
- Read `.learner/students/[slug]/projects/[activeProject]/build-map.md` to find the first unchecked item.
- Greet them: "Switched to [name]. They're working on [Project Name], currently on item [N]: [item text]. Ready to continue?"

If they have no active project (null):
- Greet them: "Switched to [name]. They don't have a project yet — use `/start` to begin one."

The sidebar will update automatically when `active.json` changes.

## Edge Cases

- If the student to switch to is already the active student: "Already working with [name]. Use `/switch` to change projects, or `/start` to begin a new one."
- If `activeProject` is set in profile but the project directory doesn't exist: treat as no active project and say "Their last project doesn't seem to be set up — use `/start` to begin a new one."
- If multiple students share the same slugified name: show the full list and ask them to clarify. Don't guess.
