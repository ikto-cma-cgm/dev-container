#!/bin/bash
# Lance opencode en mode revue de template.
# Les conventions CMA CGM et le guide d'audit sont chargés automatiquement.
# Usage: ./scripts/ai-review.sh [chemin/vers/template/]

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

TEMPLATE_PATH="${1:-.}"

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│   Mode Revue — Audit Template Backstage CMA CGM     │"
echo "│                                                     │"
echo "│   Les 19 règles CMA sont chargées en contexte      │"
echo "│   Partage le template.yaml pour démarrer l'audit   │"
echo "└─────────────────────────────────────────────────────┘"
echo ""

if [ -f "${TEMPLATE_PATH}/template.yaml" ]; then
  echo "→ Template détecté : ${TEMPLATE_PATH}/template.yaml"
  echo "→ Lance l'audit avec : 'Audite ce template'"
  echo ""
fi

OPENCODE_CONFIG="$(pwd)/opencode.review.json" opencode
