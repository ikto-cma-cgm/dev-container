#!/bin/bash

# SonarQube Scanner Template Validation Script

echo "🔍 Validating SonarQube Scanner Template..."

TEMPLATE_DIR="/Users/mak/workspace/ikki/cma/catalogs/templates/quality/sonarqube-scanner-template"

if [ ! -d "$TEMPLATE_DIR" ]; then
    echo "❌ Template directory not found: $TEMPLATE_DIR"
    exit 1
fi

echo "✅ Template directory exists"

# Check main files
FILES=(
    "template.yaml"
    "README.md"
    "SONARQUBE_BEST_PRACTICES.md"
    "skeleton/sonar-project.properties"
    "skeleton/sonar-config/docker-compose.sonar.yml"
    "skeleton/.github/workflows/sonarqube.yml"
)

for file in "${FILES[@]}"; do
    if [ ! -f "$TEMPLATE_DIR/$file" ]; then
        echo "❌ Missing file: $file"
        exit 1
    fi
    echo "✅ Found $file"
done

# Check syntax of template.yaml (basic check)
if grep -q "apiVersion: scaffolder.backstage.io/v1beta3" "$TEMPLATE_DIR/template.yaml"; then
    echo "✅ template.yaml has correct apiVersion"
else
    echo "❌ template.yaml has incorrect or missing apiVersion"
    exit 1
fi

# Check Docker Compose healthcheck
if grep -q "healthcheck:" "$TEMPLATE_DIR/skeleton/sonar-config/docker-compose.sonar.yml"; then
    echo "✅ Docker Compose has healthchecks"
else
    echo "❌ Docker Compose is missing healthchecks (crucial for ephemeral mode)"
    exit 1
fi

# Check Workflow cleanup
if grep -q "docker compose -f sonar-config/docker-compose.sonar.yml down -v" "$TEMPLATE_DIR/skeleton/.github/workflows/sonarqube.yml"; then
    echo "✅ Workflow has cleanup step"
else
    echo "❌ Workflow is missing cleanup step (crucial for ephemeral mode)"
    exit 1
fi

echo ""
echo "✨ Validation complete! The SonarQube Scanner template is ready to use."
echo "You can now register it in Backstage and start creating quality services."
