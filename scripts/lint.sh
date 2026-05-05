#!/bin/bash
# Lint a template against the 19 CMA CGM service standards.
# Usage:
#   ./scripts/lint.sh example-template/    → lint a specific template
#   ./scripts/lint.sh                      → lint all templates in templates/
set -e
cd "$(dirname "$0")" && npm install --silent && cd ..
node scripts/lint-templates.mjs "$@"
