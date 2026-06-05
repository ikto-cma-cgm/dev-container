#!/bin/bash
# Lint a template against the 19 CMA CGM service standards.
# Usage:
#   ./scripts/lint.sh output/templates/node-template  → lint a specific template directory
#   ./scripts/lint.sh output/templates                → lint all templates under a directory
#   ./scripts/lint.sh --only Composable <template>    → run composable + ADR rules only
#   ./scripts/lint.sh                                 → lint all templates in templates/
set -e
cd "$(dirname "$0")" && npm install --silent && cd ..
node scripts/lint-templates.mjs "$@"
