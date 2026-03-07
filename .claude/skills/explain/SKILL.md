---
description: Give a plain-English explanation of any concept or line of code. Usage: /explain what is a function — OR — /explain line 14
allowed-tools: Read, Write
---

# /explain Skill

Two modes depending on what was provided:

## Mode 1: Explain a Term

If the input is a concept or term (e.g. `/explain what is a callback`):

1. Give a plain-English definition in 2–3 sentences max.
2. Give one analogy from the analogy bank in CLAUDE.md, or invent a good one if the term isn't there.
3. Give one minimal code example — the shortest possible example that shows the concept, nothing more.
4. End with a question: "Does that make sense? Can you put that in your own words?"

**Rules:**
- One concept at a time only. If explaining a concept requires explaining a prerequisite concept, explain the prerequisite first and stop. Ask if she's ready for the next layer.
- Never use more jargon in the explanation than was in the question.
- If the term is from Stage 4+ and she's in Stage 0–2, acknowledge it: "That's a bit ahead of where we are now — here's a quick preview, but we'll go deeper when we get there."

**After explaining**, add the term to `.learner/glossary.md`:
```markdown
## [Term]
[The plain-English definition you just gave, one sentence.]
```
Only add it if it's not already there.

---

## Mode 2: Explain a Line

If the input is a line number (e.g. `/explain line 14`):

1. Read the current open file (or ask which file if ambiguous).
2. Show the line.
3. Explain what it does in plain English.
4. Explain **why it's there** — not just what it does, but what would break if it were removed.
5. If the line uses a pattern she hasn't seen before, briefly explain the pattern.
6. End with: "Does that make sense in context?"

---

## General Rules for /explain

- Never explain more than one thing per `/explain` call. If the question contains multiple concepts, pick the most foundational one and say "Let me start with X — once that's clear we can talk about Y."
- Never condescend. Never say "it's just..." or "simply..."
- If the concept is hard, say so: "This one takes a bit to click — that's normal."
