#!/usr/bin/env bash
# UserPromptSubmit hook — fires before each student message is sent to Claude.
# Always injects an age-appropriate content safety reminder.
# If the student also submitted a sidebar review answer, that context is appended too.
#
# Output to stdout is prepended to the student's message as additional context.

set -euo pipefail

# Always inject the age-appropriate safety context.
# This runs on every message so Claude is consistently reminded of its audience.
cat << 'SAFETY'
[SYSTEM: This is a coding education tool for students aged 13–16. Respond only to coding and learning requests. If the student's message contains vulgarity, sexual content, requests for harmful information, or anything inappropriate for minors, decline warmly without shaming and redirect to their project. Do not engage with the inappropriate content.]
SAFETY

# If a sidebar button queued a slash command, inject it so the user just needs to press Enter.
COMMAND_FILE=".learner/pending-command.json"

if [ -f "$COMMAND_FILE" ]; then
  python3 -c "
import json, os
try:
    data = json.load(open('$COMMAND_FILE'))
    cmd = data.get('command', '').strip()
    if cmd:
        print(cmd)
    os.remove('$COMMAND_FILE')
except Exception:
    pass
" 2>/dev/null || true
  exit 0
fi

# If the student also answered a review question in the sidebar, inject that context too.
ANSWER_FILE=".learner/pending-answer.json"

if [ ! -f "$ANSWER_FILE" ]; then
  exit 0
fi

# Resolve active student path for the state file reference in the injected context
ACTIVE_FILE=".learner/active.json"
read -r ACTIVE_STUDENT ACTIVE_SLUG < <(python3 -c "
import json, sys
try:
    d = json.load(open('$ACTIVE_FILE'))
    print(d.get('activeStudent', ''), d.get('activeProject', ''))
except:
    print('', '')
" 2>/dev/null || echo " ")

STATE_PATH=".learner/students/$ACTIVE_STUDENT/projects/$ACTIVE_SLUG/state.json"

# Read and output the answer context, then delete the file
python3 -c "
import json, os

answer_file = '$ANSWER_FILE'
state_path = '$STATE_PATH'

try:
    with open(answer_file, 'r') as f:
        data = json.load(f)

    question = data.get('question', '')
    answer = data.get('answer', '')
    level = data.get('questionLevel', 1)
    hints_used = data.get('hintsUsed', 0)

    context = f'''
[SIDEBAR REVIEW ANSWER]
The student just answered a review question via the sidebar panel.
Question (Level {level}): {question}
Their answer: {answer}
Hints used: {hints_used}

Please evaluate their answer. If correct: celebrate specifically, name what they got right, award XP by updating {state_path} (pendingReview.active = false, increment xp). If partially correct or incorrect: acknowledge what they got right, give the next hint level, and re-ask. Do not reveal the full answer unless this was their third hint attempt.'''

    print(context)
    os.remove(answer_file)
except Exception:
    pass
" 2>/dev/null || true
