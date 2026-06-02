#!/bin/bash
set -e

echo "Validating CICD Service Template (Multi-Provider)..."

TEMPLATE_DIR="catalogs/templates/integration/cicd-service-template"
SKELETON_DIR="$TEMPLATE_DIR/skeleton"

# Check Node.js Structure
for provider in github-actions jenkins gitlab-ci; do
    if [ ! -d "$SKELETON_DIR/nodejs/$provider" ]; then
        echo "❌ Error: Node.js $provider skeleton missing"
        exit 1
    fi
done

# Check React Structure
for provider in github-actions jenkins gitlab-ci; do
    if [ ! -d "$SKELETON_DIR/react/$provider" ]; then
        echo "❌ Error: React $provider skeleton missing"
        exit 1
    fi
done

# Check Java Structure
for provider in github-actions jenkins gitlab-ci; do
    if [ ! -d "$SKELETON_DIR/java/$provider" ]; then
        echo "❌ Error: Java $provider skeleton missing"
        exit 1
    fi
done

echo "✅ Multi-provider structure check passed."
