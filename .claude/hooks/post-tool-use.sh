#!/usr/bin/env bash
# PostToolUse hook — fires after Claude uses Write or Edit tools.
# Reads tool info from stdin (JSON), checks if a code file was written,
# and updates the active project's state.json to signal the sidebar to show a review card.

set -euo pipefail

# Read stdin (tool use info from Claude Code)
INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    inp = d.get('tool_input', {})
    print(inp.get('file_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

# Only act on .js, .jsx, .ts, .tsx files
if [[ "$FILE_PATH" != *.js && "$FILE_PATH" != *.jsx && "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Skip state/config files inside .learner/
if [[ "$FILE_PATH" == *".learner/"* ]]; then
  exit 0
fi

# Resolve active student and project from .learner/active.json
ACTIVE_FILE=".learner/active.json"
read -r ACTIVE_STUDENT ACTIVE_SLUG < <(python3 -c "
import json, sys
try:
    d = json.load(open('$ACTIVE_FILE'))
    print(d.get('activeStudent', ''), d.get('activeProject', ''))
except:
    print('', '')
" 2>/dev/null || echo " ")

if [ -z "$ACTIVE_STUDENT" ] || [ -z "$ACTIVE_SLUG" ]; then
  exit 0
fi

STATE_FILE=".learner/students/$ACTIVE_STUDENT/projects/$ACTIVE_SLUG/state.json"

if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

# Update state.json to flag a pending review
python3 -c "
import json, sys

state_file = '$STATE_FILE'
file_path = '$FILE_PATH'

try:
    with open(state_file, 'r') as f:
        state = json.load(f)
except:
    sys.exit(0)

# Only set pendingReview if there isn't already one active
if not state.get('pendingReview', {}).get('active', False):
    state['pendingReview'] = {
        'active': True,
        'filePath': file_path,
        'questionLevel': 1,
        'question': '',
        'format': 'text',
        'hints': [],
        'hintsUsed': 0
    }

with open(state_file, 'w') as f:
    json.dump(state, f, indent=2)
" 2>/dev/null || true
