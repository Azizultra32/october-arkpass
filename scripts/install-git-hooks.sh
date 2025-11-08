#!/usr/bin/env bash
#
# Install Git Hooks
# Copies constitutional protection hooks from scripts/git-hooks/ to .git/hooks/
#

set -euo pipefail

echo "Installing constitutional protection git hooks..."
echo ""

# Install pre-commit hook
if [ -f "scripts/git-hooks/pre-commit" ]; then
    cp scripts/git-hooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "✅ Installed pre-commit hook (constitutional protection)"
else
    echo "❌ Error: scripts/git-hooks/pre-commit not found"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Git hooks installed successfully!"
echo ""
echo "Protected files:"
echo "  - ARKPASS_DEV_TENET_PRIME.md (requires Royal Decree)"
echo ""
echo "To bypass hook: git commit --no-verify (emergencies only)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
