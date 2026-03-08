---
description: Switch to a different project and pick up where you left off. Lists all projects with their progress, then activates the one you choose.
---

# /switch Skill

The student wants to switch to a different project (or see what projects they have).

## Step 1 — Discover Projects

Read all subdirectories under `.learner/projects/`. For each one that contains a `config.json`, read:
- `config.json` → `projectName`, `lastSession`, `projectDir`
- `build-map.md` → count `[x]` (complete) and `[ ]` (incomplete) items to get progress

## Step 2 — Display Project List

Show a numbered list like this:

```
Your projects:

1. Football Quiz — 3/6 items done, last session 2026-03-01
2. Pet Tracker — 0/8 items done, last session 2026-02-20

Which one do you want to switch to? (type the number)
```

If only one project exists, say:
"You only have one project right now — [Project Name]. You're already on it! Use `/start` if you want to begin a new one."
And stop.

If `.learner/projects/` doesn't exist or is empty, say:
"You don't have any projects yet. Use `/start` to create one."
And stop.

## Step 3 — Switch

Once the student picks a project (by number or name):

1. Note the slug for that project (the directory name under `.learner/projects/`).
2. Write `.learner/active.json`:
   ```json
   { "activeProject": "[slug]" }
   ```
3. Read the project's `config.json` and `build-map.md`.
4. Find the first unchecked Build Map item.
5. Greet them:
   "Switched to [Project Name]. You're on item [N]: [item text]. Ready to pick up where you left off?"

The sidebar will update automatically when `active.json` changes.

## Edge Cases

- If they're already on the project they picked: "You're already working on [Project Name]! Ready to continue?"
- If a project directory exists but has no `config.json` (incomplete setup): skip it and don't list it.
- If `build-map.md` is missing or all items are checked: note that the project is complete — "All items done! You can use `/challenge` for a stretch exercise or `/start` to begin something new."
