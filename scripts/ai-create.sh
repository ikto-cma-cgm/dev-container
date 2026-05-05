#!/bin/bash
# Lance opencode en mode création de template.
# Les conventions CMA CGM et le guide de création sont chargés automatiquement.
# Usage: ./scripts/ai-create.sh

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│   Mode Création — Template Backstage CMA CGM        │"
echo "│                                                     │"
echo "│   Les conventions CMA (19 règles) sont en contexte │"
echo "│   Décris le template que tu veux créer pour démarrer│"
echo "└─────────────────────────────────────────────────────┘"
echo ""

OPENCODE_CONFIG="$(pwd)/opencode.create.json" opencode
