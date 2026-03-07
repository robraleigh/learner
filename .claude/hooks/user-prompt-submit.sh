#!/usr/bin/env bash
# UserPromptSubmit hook — fires before each student message is sent to Claude.
# If the student answered a review question in the sidebar, that answer was
# written to .learner/pending-answer.json. This hook injects it as context
# into the student's message so Claude can evaluate it.
#
# Output to stdout is prepended to the student's message as additional context.

set -euo pipefail

ANSWER_FILE=".learner/pending-answer.json"

if [ ! -f "$ANSWER_FILE" ]; then
  exit 0
fi

# Read and output the context, then delete the file
python3 -c "
import json, os

answer_file = '$ANSWER_FILE'

try:
    with open(answer_file, 'r') as f:
        data = json.load(f)

    question = data.get('question', '')
    answer = data.get('answer', '')
    level = data.get('questionLevel', 1)
    hints_used = data.get('hintsUsed', 0)

    context = f'''[SIDEBAR REVIEW ANSWER]
The student just answered a review question via the sidebar panel.
Question (Level {level}): {question}
Her answer: {answer}
Hints used: {hints_used}

Please evaluate her answer. If correct: celebrate specifically, name what she got right, award XP by updating .learner/state.json (pendingReview.active = false, increment xp). If partially correct or incorrect: acknowledge what she got right, give the next hint level, and re-ask. Do not reveal the full answer unless this was her third hint attempt.'''

    print(context)
    os.remove(answer_file)
except Exception as e:
    pass
" 2>/dev/null || true
