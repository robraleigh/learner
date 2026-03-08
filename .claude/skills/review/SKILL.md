---
description: Trigger a guided code review of the current file. Generates escalating questions (What → How → Why → What-if → Design), tracks answers, awards XP. Use after completing any Build Map item or any time the student wants to check their understanding.
allowed-tools: Read, Write
---

# /review Skill

Read `.learner/config.json` to get `projectDir`. If a filename was provided (e.g. `/review quiz.js`), read `projectDir/quiz.js`. Otherwise, read the most recently modified `.js` file inside `projectDir`.

Read `.learner/progress.json` for the student's stage and review history to calibrate question difficulty.

## Question Escalation Ladder

Generate 2–4 questions for the review session, starting at Level 1 and only escalating when they answer correctly and confidently.

**Level 1 — What** (always start here)
Point to something specific in the code.
- "Point to the line that checks whether the answer is correct."
- "Which line stores the user's input?"
- "Find the loop in this code."

**Level 2 — How**
Walk through the execution.
- "Walk me through what happens, step by step, when a user types the wrong answer."
- "If I call `checkAnswer('Paris', 'London')`, what does the function return?"

**Level 3 — Why**
Design decisions.
- "Why is the `score` variable declared outside the loop instead of inside it?"
- "Why did we use `const` for `questions` but `let` for `score`?"
- "Why do we load questions from a file instead of writing them directly in the code?"

**Level 4 — What-if**
Hypothetical modifications.
- "What do you think would happen if we removed the `return` statement from `checkAnswer`? Have a guess, then try it."
- "What would happen if the loop started at `i = 1` instead of `i = 0`?"

**Level 5 — Design**
Alternative approaches.
- "Could you think of a different way to store the questions? What would be better or worse about it?"
- "If you were building this for 100 users instead of one, what would you change?"

---

## Running the Review

Ask one question at a time. Wait for their answer before asking the next.

**If they answer correctly:**
- Acknowledge specifically what they got right ("You correctly spotted that `score` is outside the loop — that's exactly it.")
- Award XP and update `.learner/state.json` and `progress.json`
- Escalate to the next level if appropriate

**If they're partially right:**
- Acknowledge what's correct first
- Name the gap without giving the answer
- Offer a nudge: "Think about what the word `return` does in a function generally."
- If they're still stuck: tell them to type `/hint` for more help

**If they're wrong:**
- Don't say "wrong" or "incorrect" — say "not quite" or "let's look at this differently"
- Acknowledge anything that was right in their answer
- Point them toward `/hint`

---

## Hint Levels (delivered via /hint skill)

Pre-write three hints for each question when generating the review. Store them in `state.json`:

```json
"pendingReview": {
  "active": true,
  "filePath": "projects/my-quiz-app/quiz.js",
  "questionLevel": 2,
  "question": "Walk me through what happens when a user types the wrong answer.",
  "format": "text",
  "hints": [
    "Start from the top of the function. What's the first thing that happens?",
    "The `if` condition is checked first. Since the answer is wrong, `userAnswer === correctAnswer` is false. So which branch runs?",
    "The `else` branch runs, which returns `false`. The calling code receives `false` and prints 'Try again'. That's the full path."
  ],
  "hintsUsed": 0
}
```

---

## XP Awards

Update both `.learner/state.json` and `.learner/progress.json`:

- Level 1 question answered correctly, no hints: 25 XP
- Level 2+ question answered correctly, no hints: 25 XP
- Answered correctly with 1–2 hints: 10 XP
- Answered correctly with 3 hints (full reveal): 5 XP

Also log the result to `progress.json.reviewHistory`:
```json
{
  "date": "[today]",
  "file": "projects/my-quiz-app/quiz.js",
  "questionsAsked": 3,
  "firstTryCorrect": 2,
  "hintsUsed": 1,
  "xpEarned": 60
}
```

---

## Wrapping Up

After the final question, give a summary:
- What they got right on the first try
- One thing to keep in mind going forward
- Any badge earned (see CLAUDE.md for badge criteria)

Then suggest the next action: "Ready to move to the next item? Type `/next`."
