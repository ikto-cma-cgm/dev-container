#!/bin/bash
# WebdriverIO Service Entrypoint
# Cross-platform compatible entrypoint script

set -e

# Color output for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}WebdriverIO Testing Service${NC}"
echo -e "${GREEN}Quality Platform Team${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Display environment info
echo -e "${YELLOW}Environment Information:${NC}"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Chrome version: $(chromium --version)"
echo "Working directory: $(pwd)"
echo "Platform: $(uname -s) $(uname -m)"
echo ""

# Check if test files exist
if [ ! -d "/tests/tests" ] || [ -z "$(ls -A /tests/tests 2>/dev/null)" ]; then
    echo -e "${YELLOW}Warning: No test files found in /tests/tests${NC}"
    echo "Please mount your test directory to /tests/tests"
fi

# Check if config exists
if [ ! -f "/tests/wdio-config/wdio.conf.js" ]; then
    echo -e "${YELLOW}Warning: No wdio.conf.js found in /tests/wdio-config${NC}"
    echo "Using base configuration from /tests/config/wdio.base.conf.js"

    # Create wdio-config directory if it doesn't exist
    mkdir -p /tests/wdio-config

    # Copy base config if user config doesn't exist
    if [ ! -f "/tests/wdio-config/wdio.conf.js" ]; then
        cp /tests/config/wdio.base.conf.js /tests/wdio-config/wdio.conf.js
        echo "Base configuration copied to /tests/wdio-config/wdio.conf.js"
    fi
fi

echo ""
echo -e "${GREEN}Starting tests...${NC}"
echo ""

# Execute the command
# If first argument is "test", run npm test
# If first argument is "bash" or "sh", open shell
# Otherwise, execute the provided command
case "$1" in
    test)
        exec npm run test:e2e
        ;;
    bash|sh)
        exec /bin/bash
        ;;
    npm|wdio)
        exec "$@"
        ;;
    *)
        if [ $# -eq 0 ]; then
            # No arguments, run default test command
            exec npm run test:e2e
        else
            # Execute whatever command was provided
            exec "$@"
        fi
        ;;
esac
