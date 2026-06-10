#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Charge .env si présent
if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

if [[ -z "${TEMPLATES_REPO_URL:-}" ]]; then
  echo "Erreur : TEMPLATES_REPO_URL n'est pas défini." >&2
  echo "Ajoute TEMPLATES_REPO_URL=<url> dans ton fichier .env." >&2
  exit 1
fi

TEMPLATES_DIR="$ROOT_DIR/../templates"

if [[ -d "$TEMPLATES_DIR/.git" ]]; then
  echo "Mise à jour des templates depuis $TEMPLATES_REPO_URL..."
  git -C "$TEMPLATES_DIR" pull --ff-only
else
  echo "Clonage des templates depuis $TEMPLATES_REPO_URL..."
  rm -rf "$TEMPLATES_DIR"
  git clone "$TEMPLATES_REPO_URL" "$TEMPLATES_DIR"
fi

echo "Templates prêts dans $TEMPLATES_DIR"
