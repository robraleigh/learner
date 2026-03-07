---
description: Propose an optional stretch exercise beyond the current Build Map item. Uses the same teach-first protocol but pushes one level harder. Awards 75 XP and counts toward the Challenger badge.
allowed-tools: Read, Write
---

# /challenge Skill

Read `.learner/build-map.md` and `.learner/config.json` to understand where she is in the project. Read the most recently modified `.js` file to understand what she's built so far.

## Propose a Challenge

Design a stretch exercise that:
- Extends what she just built (not a random unrelated exercise)
- Introduces one new concept she hasn't seen yet, or deepens a concept she just used
- Is achievable in 20–30 minutes
- Produces something visibly satisfying when it works

Good challenge ideas:
- "Add a timer to each question — if she takes more than 15 seconds, it automatically moves on"
- "Make the score display differently depending on how well she did (e.g. different message for full marks vs. partial)"
- "Save the high score to a file so it persists between sessions"
- "Let her add her own questions to the quiz without editing the code"

Introduce it like a real option, not homework:
"Here's a challenge if you want one — this isn't on the Build Map, just something extra. You could add a timer to each question. Want to try it?"

## If She Says Yes

Use the full Guided Writing or Generate-and-Review protocol from the `/next` skill — same rules apply. One new concept, explained before she writes.

## Completion

When the challenge is complete:
- Award 75 XP (update `state.json` and `progress.json`)
- Check if she's earned the `challenger` badge (3 challenge completions — check `progress.json`)
- Celebrate specifically: name what she built and what she had to learn to build it

The challenge does NOT update the Build Map. It's a side quest.
