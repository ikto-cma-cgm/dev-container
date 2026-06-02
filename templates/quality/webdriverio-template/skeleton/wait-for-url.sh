#!/bin/bash
# wait-for-url.sh
set -e

# Detect if the first argument is a URL (starts with http)
if [[ "$1" == http* ]]; then
    TARGET_URL="$1"
    shift
else
    # Fallback to BASE_URL env var or default
    TARGET_URL="${BASE_URL:-http://host.docker.internal:3000}"
fi

# Clean up TARGET_URL if it wrongly contains shell characters or unexpanded vars
if [[ "$TARGET_URL" == *'$'* ]] || [ -z "$TARGET_URL" ]; then
    TARGET_URL="http://host.docker.internal:3000"
fi

echo "🔍 Target URL: $TARGET_URL"

# Wait loop
MAX_ATTEMPTS=30
ATTEMPT=0

until curl -s "$TARGET_URL" > /dev/null || [ $ATTEMPT -eq $MAX_ATTEMPTS ]; do
  >&2 echo "⏳ Waiting for app at $TARGET_URL (Attempt $((ATTEMPT+1))/$MAX_ATTEMPTS)..."
  sleep 2
  ATTEMPT=$((ATTEMPT+1))
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    >&2 echo "❌ Error: App at $TARGET_URL is still down after $((MAX_ATTEMPTS*2))s."
    >&2 echo "👉 Make sure your app is running on your Mac at $TARGET_URL"
    >&2 echo "👉 If you are using Docker, use http://host.docker.internal:3000"
    exit 1
fi

>&2 echo "✅ App is UP! Executing command: $@"
exec "$@"
