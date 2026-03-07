#!/usr/bin/env bash
# PostToolUse hook — fires after Claude uses Write or Edit tools.
# Reads tool info from stdin (JSON), checks if a .js file was written,
# and updates .learner/state.json to signal the sidebar to show a review card.

set -euo pipefail

# Read stdin (tool use info from Claude Code)
INPUT=$(cat)

# Extract tool name and file path using python3
TOOL_NAME=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_name', ''))
except:
    print('')
" 2>/dev/null || echo "")

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    inp = d.get('tool_input', {})
    print(inp.get('file_path', ''))
except:
    print('')
" 2>/dev/null || echo "")

# Only act on .js files
if [[ "$FILE_PATH" != *.js ]]; then
  exit 0
fi

STATE_FILE=".learner/state.json"

# Only act if .learner/state.json exists (i.e. /start has been run)
if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

# Update state.json to flag a pending review
python3 -c "
import json, sys, os

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
    # Note: Claude will fill in the actual question content via /review
    # This flag just tells the sidebar that a review is pending

with open(state_file, 'w') as f:
    json.dump(state, f, indent=2)
" 2>/dev/null || true
