#!/bin/bash
# Proxy manuel — normalement lancé automatiquement à l'ouverture du devcontainer
# via initializeCommand dans devcontainer.json (si VLLM_HOST est défini dans .env).
#
# Utiliser ce script uniquement si tu travailles sans devcontainer.
# Usage : ./start-proxy.sh    (depuis ton Mac, PAS depuis le container)
# Arrêt : Ctrl+C

exec bash .devcontainer/start-proxy-host.sh "$@"
