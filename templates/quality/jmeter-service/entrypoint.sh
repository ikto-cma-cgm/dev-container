#!/bin/bash
# JMeter Service Entrypoint
# Cross-platform compatible entrypoint script

set -e

# Color output for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}JMeter Load Testing Service${NC}"
echo -e "${GREEN}Quality Platform Team${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Display environment info
echo -e "${YELLOW}Environment Information:${NC}"
echo "JMeter version: $(jmeter --version 2>&1 | head -1)"
echo "Java version: $(java -version 2>&1 | head -1)"
echo "Working directory: $(pwd)"
echo "Platform: $(uname -s) $(uname -m)"
echo ""

# Display test configuration
echo -e "${YELLOW}Test Configuration:${NC}"
echo "Target: ${TARGET_PROTOCOL}://${TARGET_HOST}:${TARGET_PORT}"
echo "Threads: ${THREADS}"
echo "Ramp-up: ${RAMP_UP}s"
echo "Duration: ${DURATION}s"
echo "Generate Report: ${GENERATE_REPORT}"
echo ""

# Check if test plans exist
if [ ! -d "/jmeter/test-plans" ] || [ -z "$(ls -A /jmeter/test-plans 2>/dev/null)" ]; then
    echo -e "${YELLOW}Warning: No test plans found in /jmeter/test-plans${NC}"
    echo "Please mount your test plans to /jmeter/test-plans"
    echo ""
fi

# Check for specific test plan
if [ -n "$TEST_PLAN" ] && [ ! -f "/jmeter/test-plans/$TEST_PLAN" ]; then
    echo -e "${RED}Error: Test plan not found: /jmeter/test-plans/$TEST_PLAN${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Starting JMeter...${NC}"
echo ""

# Execute the command
case "$1" in
    run-tests)
        # Default test execution
        if [ -n "$TEST_PLAN" ]; then
            PLAN="/jmeter/test-plans/$TEST_PLAN"
        else
            # Find first .jmx file
            PLAN=$(find /jmeter/test-plans -name "*.jmx" -type f 2>/dev/null | head -1)
        fi

        if [ -z "$PLAN" ]; then
            echo -e "${RED}Error: No test plan specified and none found${NC}"
            echo "Set TEST_PLAN environment variable or mount .jmx files to /jmeter/test-plans"
            exit 1
        fi

        echo "Running test plan: $PLAN"
        echo ""

        # Apply JVM heap settings
        export JVM_ARGS="${HEAP}"

        # Build JMeter command
        JMETER_CMD="jmeter -n -t \"$PLAN\" -l /jmeter/results/results.jtl -j /jmeter/logs/jmeter.log"

        # Add property overrides
        JMETER_CMD="$JMETER_CMD -Jtarget.host=\"$TARGET_HOST\""
        JMETER_CMD="$JMETER_CMD -Jtarget.port=\"$TARGET_PORT\""
        JMETER_CMD="$JMETER_CMD -Jtarget.protocol=\"$TARGET_PROTOCOL\""
        JMETER_CMD="$JMETER_CMD -Jthreads=\"$THREADS\""
        JMETER_CMD="$JMETER_CMD -Jrampup=\"$RAMP_UP\""
        JMETER_CMD="$JMETER_CMD -Jduration=\"$DURATION\""

        # Add report generation if enabled
        if [ "$GENERATE_REPORT" = "true" ]; then
            JMETER_CMD="$JMETER_CMD -e -o /jmeter/reports"
        fi

        # Execute JMeter
        eval $JMETER_CMD

        # Check exit code
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            echo ""
            echo -e "${GREEN}Tests completed successfully!${NC}"
            if [ "$GENERATE_REPORT" = "true" ]; then
                echo "Report generated at: /jmeter/reports/index.html"
            fi
        else
            echo ""
            echo -e "${RED}Tests failed with exit code: $EXIT_CODE${NC}"
            exit $EXIT_CODE
        fi
        ;;

    jmeter)
        # Direct JMeter command
        export JVM_ARGS="${HEAP}"
        shift
        exec jmeter "$@"
        ;;

    bash|sh)
        # Interactive shell
        exec /bin/bash
        ;;

    *)
        # Execute custom command
        exec "$@"
        ;;
esac
