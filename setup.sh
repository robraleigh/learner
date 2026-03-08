#!/usr/bin/env bash
# setup.sh — Run once after cloning to build and install the Learner sidebar extension.
# After this, just open learner.code-workspace in VS Code and everything is ready.

set -e

echo ""
echo "Setting up the Learner extension..."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed."
  echo "Download it from https://nodejs.org (choose the LTS version)"
  exit 1
fi

# Check for code CLI
if ! command -v code &> /dev/null; then
  echo "Error: The 'code' command is not available."
  echo "In VS Code: open the Command Palette (Cmd+Shift+P) and run:"
  echo "  Shell Command: Install 'code' command in PATH"
  echo "Then run this script again."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_DIR="$SCRIPT_DIR/extension"

# Create the projects directory (student projects live here, gitignored)
mkdir -p "$SCRIPT_DIR/projects"

echo "1/3 Installing extension dependencies..."
cd "$EXTENSION_DIR"
npm install --silent

echo "2/3 Compiling TypeScript..."
npm run compile

echo "3/3 Packaging and installing extension..."
npm run package
code --install-extension "$EXTENSION_DIR/learner.vsix" --force

echo ""
echo "Done! The Learner sidebar is now installed."
echo ""
echo "Next steps:"
echo "  1. Open learner.code-workspace in VS Code"
echo "  2. Open the Claude Code chat (Cmd+Shift+C)"
echo "  3. Type: /start \"your project idea\""
echo ""
