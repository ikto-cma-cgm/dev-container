#!/bin/bash
# Lance un proxy TCP sur ta machine (hôte Docker) qui relaie le trafic
# du container vers le serveur vLLM du réseau local.
#
# Prérequis : brew install socat
# Usage     : ./start-proxy.sh          (depuis ton Mac, PAS depuis le container)
# Arrêt     : Ctrl+C

REMOTE_HOST="192.168.0.23"
REMOTE_PORT="8000"
LOCAL_PORT="8000"

if ! command -v socat &> /dev/null; then
  echo "socat non trouvé. Installation..."
  brew install socat
fi

echo "→ Proxy démarré : localhost:${LOCAL_PORT} → ${REMOTE_HOST}:${REMOTE_PORT}"
echo "  Le container peut accéder au vLLM via http://host.docker.internal:${LOCAL_PORT}/v1"
echo "  Ctrl+C pour arrêter."
echo ""

socat TCP-LISTEN:${LOCAL_PORT},fork,reuseaddr TCP:${REMOTE_HOST}:${REMOTE_PORT}
