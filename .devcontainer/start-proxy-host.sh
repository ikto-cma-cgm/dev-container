#!/bin/bash
# Démarre le proxy TCP sur le Mac hôte pour relayer le trafic du container vers le serveur vLLM.
# Appelé automatiquement par devcontainer.json (initializeCommand) — s'exécute sur ton Mac, pas dans le container.
# Prérequis : socat (installé automatiquement via Homebrew si absent)

LOG="/tmp/devcontainer-proxy.log"
exec > >(tee -a "$LOG") 2>&1
echo "[$(date)] → start-proxy-host.sh démarré"

# Homebrew n'est pas dans le PATH de VS Code — on l'ajoute explicitement
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

ENV_FILE="$(dirname "$0")/../.env"
VLLM_HOST=""
VLLM_PORT="8000"
AI_API_BASE=""

if [ -f "$ENV_FILE" ]; then
  while IFS= read -r line; do
    key="${line%%=*}"
    val="${line#*=}"
    key="${key// /}"
    [ "${key:0:1}" = "#" ] && continue
    [ -z "$key" ] && continue
    case "$key" in
      VLLM_HOST)    VLLM_HOST="${val%% *}" ;;
      VLLM_PORT)    VLLM_PORT="${val%% *}" ;;
      AI_API_BASE)  AI_API_BASE="${val%% *}" ;;
    esac
  done < "$ENV_FILE"
fi

if [ -z "$VLLM_HOST" ]; then
  echo "→ VLLM_HOST non défini dans .env — proxy non démarré."
  exit 0
fi

# Extrait le port local depuis AI_API_BASE (ex: http://host.docker.internal:18000/v1 → 18000)
LOCAL_PORT=$(echo "$AI_API_BASE" | grep -oE ':[0-9]+/' | tr -d ':/')
if [ -z "$LOCAL_PORT" ]; then
  LOCAL_PORT="18000"
fi

echo "→ VLLM_HOST=$VLLM_HOST VLLM_PORT=$VLLM_PORT LOCAL_PORT=$LOCAL_PORT"

if ! command -v socat &>/dev/null; then
  echo "→ socat introuvable, installation via Homebrew..."
  brew install socat || { echo "ERREUR: brew install socat a échoué"; exit 1; }
fi

# Vérifier si le port local est déjà occupé par autre chose
if lsof -i ":${LOCAL_PORT}" -sTCP:LISTEN &>/dev/null; then
  if pgrep -f "socat.*${LOCAL_PORT}.*${VLLM_HOST}" &>/dev/null; then
    echo "→ Proxy déjà actif : localhost:${LOCAL_PORT} → ${VLLM_HOST}:${VLLM_PORT}"
    exit 0
  else
    echo "ERREUR: port ${LOCAL_PORT} occupé par un autre processus ($(lsof -i \":${LOCAL_PORT}\" -sTCP:LISTEN | awk 'NR>1 {print $1}'))"
    echo "  → Changer AI_API_BASE dans .env pour utiliser un port libre."
    exit 1
  fi
fi

nohup socat TCP-LISTEN:${LOCAL_PORT},fork,reuseaddr TCP:${VLLM_HOST}:${VLLM_PORT} \
  >>/tmp/socat-vllm.log 2>&1 &
PROXY_PID=$!

sleep 0.3
if kill -0 "$PROXY_PID" 2>/dev/null; then
  echo "→ Proxy démarré (PID: $PROXY_PID) : localhost:${LOCAL_PORT} → ${VLLM_HOST}:${VLLM_PORT}"
else
  echo "ERREUR: socat a démarré puis est mort — voir /tmp/socat-vllm.log"
  cat /tmp/socat-vllm.log
  exit 1
fi
