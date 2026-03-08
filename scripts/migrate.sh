#!/usr/bin/env bash
# migrate.sh — Migrate a student's state from the old flat .learner/ format
# (or the intermediate .learner/projects/[slug]/ format) to the new
# student-scoped format: .learner/students/[name]/projects/[slug]/
#
# Run from the repo root.

set -euo pipefail

echo ""
echo "=== Learner State Migration ==="
echo "This script moves your student's state files into the new format."
echo ""

LEARNER_DIR=".learner"

# ── Detect source format ──────────────────────────────────────────────────────

SOURCE_FORMAT=""
SOURCE_DIR=""

if [ -f "$LEARNER_DIR/config.json" ]; then
  SOURCE_FORMAT="flat"
  SOURCE_DIR="$LEARNER_DIR"
  echo "Detected: old flat format (.learner/config.json)"
elif [ -f "$LEARNER_DIR/active.json" ]; then
  # Check if it's the intermediate format (activeProject only) or new format (activeStudent too)
  HAS_STUDENT=$(python3 -c "
import json
d = json.load(open('$LEARNER_DIR/active.json'))
print('yes' if d.get('activeStudent') else 'no')
" 2>/dev/null || echo "no")

  if [ "$HAS_STUDENT" = "yes" ]; then
    echo "This repo already uses the new format. Nothing to migrate."
    exit 0
  fi

  # Intermediate format: .learner/projects/[slug]/
  EXISTING_SLUG=$(python3 -c "
import json
d = json.load(open('$LEARNER_DIR/active.json'))
print(d.get('activeProject', ''))
" 2>/dev/null || echo "")

  if [ -n "$EXISTING_SLUG" ] && [ -d "$LEARNER_DIR/projects/$EXISTING_SLUG" ]; then
    SOURCE_FORMAT="projects"
    SOURCE_DIR="$LEARNER_DIR/projects/$EXISTING_SLUG"
    echo "Detected: intermediate format (.learner/projects/$EXISTING_SLUG/)"
  fi
fi

if [ -z "$SOURCE_FORMAT" ]; then
  echo "No recognisable state files found in $LEARNER_DIR/."
  echo "If you have state files elsewhere, move them to $LEARNER_DIR/ first, then re-run."
  exit 1
fi

# ── Read existing config ──────────────────────────────────────────────────────

CONFIG_FILE="$SOURCE_DIR/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: config.json not found at $CONFIG_FILE"
  exit 1
fi

DETECTED_NAME=$(python3 -c "
import json
d = json.load(open('$CONFIG_FILE'))
print(d.get('studentName', ''))
" 2>/dev/null || echo "")

DETECTED_PROJECT=$(python3 -c "
import json
d = json.load(open('$CONFIG_FILE'))
print(d.get('projectName', ''))
" 2>/dev/null || echo "")

# Derive slug from projectName
DETECTED_SLUG=$(python3 -c "
import re
name = '$DETECTED_PROJECT'
slug = name.lower().strip()
slug = re.sub(r'[^a-z0-9 -]', '', slug)
slug = re.sub(r'\s+', '-', slug)
slug = slug.strip('-')
print(slug or 'my-project')
" 2>/dev/null || echo "my-project")

echo ""
echo "Found: student=\"$DETECTED_NAME\", project=\"$DETECTED_PROJECT\" (slug: $DETECTED_SLUG)"
echo ""

# ── Prompt for confirmation / override ───────────────────────────────────────

read -rp "Student name [$DETECTED_NAME]: " INPUT_NAME
STUDENT_NAME="${INPUT_NAME:-$DETECTED_NAME}"
if [ -z "$STUDENT_NAME" ]; then
  read -rp "Enter student name: " STUDENT_NAME
fi

read -rp "Project slug [$DETECTED_SLUG]: " INPUT_SLUG
SLUG="${INPUT_SLUG:-$DETECTED_SLUG}"

echo ""
echo "Will migrate to: .learner/students/$STUDENT_NAME/projects/$SLUG/"
read -rp "Proceed? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
  echo "Aborted."
  exit 0
fi

# ── Create destination directories ───────────────────────────────────────────

DEST_DIR="$LEARNER_DIR/students/$STUDENT_NAME/projects/$SLUG"
STUDENT_DIR="$LEARNER_DIR/students/$STUDENT_NAME"
mkdir -p "$DEST_DIR"

# ── Move state files ──────────────────────────────────────────────────────────

FILES_MOVED=0
for f in config.json build-map.md state.json progress.json glossary.md; do
  if [ -f "$SOURCE_DIR/$f" ]; then
    cp "$SOURCE_DIR/$f" "$DEST_DIR/$f"
    FILES_MOVED=$((FILES_MOVED + 1))
    echo "  Copied: $f"
  else
    echo "  Skipped (not found): $f"
  fi
done

# ── Create profile.json from progress.json ────────────────────────────────────

if [ ! -f "$STUDENT_DIR/profile.json" ]; then
  python3 -c "
import json, os

student_dir = '$STUDENT_DIR'
progress_path = '$DEST_DIR/progress.json'
config_path = '$DEST_DIR/config.json'
today = __import__('datetime').date.today().isoformat()

xp = 0
level = 1
level_title = 'Debug Mode'
badges = []
stage = 0
start_date = today

try:
    p = json.load(open(progress_path))
    xp = p.get('xp', 0)
    level = p.get('level', 1)
    level_title = p.get('levelTitle', 'Debug Mode')
    badges = p.get('badges', [])
except:
    pass

try:
    c = json.load(open(config_path))
    stage = c.get('stage', 0)
    start_date = c.get('startDate', today)
except:
    pass

profile = {
    'studentName': '$STUDENT_NAME',
    'overallStage': stage,
    'startDate': start_date,
    'lastSession': today,
    'activeProject': '$SLUG',
    'projectsCompleted': [],
    'conceptsLearned': [],
    'weakAreas': [],
    'strengths': [],
    'totalXP': xp,
    'level': level,
    'levelTitle': level_title,
    'badges': badges
}

with open(os.path.join(student_dir, 'profile.json'), 'w') as f:
    json.dump(profile, f, indent=2)
print('  Created: profile.json')
" 2>/dev/null
fi

# ── Create notes.md if missing ────────────────────────────────────────────────

NOTES_FILE="$STUDENT_DIR/notes.md"
if [ ! -f "$NOTES_FILE" ]; then
  cat > "$NOTES_FILE" << EOF
# Teaching Notes: $STUDENT_NAME

## What clicks

## Areas to reinforce

## Per-project

### $SLUG

EOF
  echo "  Created: notes.md"
fi

# ── Write new active.json ─────────────────────────────────────────────────────

cat > "$LEARNER_DIR/active.json" << EOF
{
  "activeStudent": "$STUDENT_NAME",
  "activeProject": "$SLUG"
}
EOF
echo "  Updated: active.json"

# ── Remove old state dir if it was the projects/ format ──────────────────────

if [ "$SOURCE_FORMAT" = "projects" ] && [ -d "$LEARNER_DIR/projects" ]; then
  echo ""
  read -rp "Remove old .learner/projects/ directory? (y/n): " REMOVE_OLD
  if [ "$REMOVE_OLD" = "y" ]; then
    rm -rf "$LEARNER_DIR/projects"
    echo "  Removed: .learner/projects/"
  fi
fi

# ── Done ──────────────────────────────────────────────────────────────────────

echo ""
echo "=== Migration complete ==="
echo ""
echo "State is now at:  $DEST_DIR/"
echo "Student profile:  $STUDENT_DIR/profile.json"
echo "Active session:   $LEARNER_DIR/active.json"
echo ""
echo "Next steps:"
echo "  1. Open profile.json and fill in conceptsLearned and weakAreas based on what was covered."
echo "  2. Open notes.md and add any teaching observations from previous sessions."
echo "  3. Start a new Claude Code session — it will greet $STUDENT_NAME and pick up where they left off."
echo ""
