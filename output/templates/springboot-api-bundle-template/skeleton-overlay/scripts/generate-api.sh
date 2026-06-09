#!/usr/bin/env bash
# Run once after first clone to inline the OpenAPI-generated sources.
# After this script, all Java files are normal editable sources — no codegen at build time.
set -euo pipefail

GENERATED_SOURCES="target/generated-sources/openapi/src/main/java"
SRC_MAIN_JAVA="src/main/java"

echo "▶ Generating sources from src/main/resources/api/openapi.yaml …"
mvn generate-sources -q

echo "▶ Copying generated sources to ${SRC_MAIN_JAVA} …"
if [ ! -d "${GENERATED_SOURCES}" ]; then
  echo "❌ Generated sources not found at ${GENERATED_SOURCES}. Did mvn generate-sources succeed?"
  exit 1
fi
cp -r "${GENERATED_SOURCES}/." "${SRC_MAIN_JAVA}/"

echo "▶ Removing placeholder stubs …"
rm -rf "${SRC_MAIN_JAVA}/com/example/service"

echo "▶ Removing openapi-generator-maven-plugin from pom.xml …"
python3 - <<'EOF'
import re

with open('pom.xml', 'r') as f:
    content = f.read()

pattern = r'\s*<plugin>\s*<groupId>org\.openapitools</groupId>.*?</plugin>'
cleaned = re.sub(pattern, '', content, flags=re.DOTALL)
cleaned = re.sub(r'\s*<openapi-generator\.version>[^<]+</openapi-generator\.version>', '', cleaned)

with open('pom.xml', 'w') as f:
    f.write(cleaned)
EOF

echo ""
echo "✅ Done. Generated sources are in ${SRC_MAIN_JAVA}/${{ values.packagePath }}/api/"
echo ""
echo "   Next steps:"
echo "   1. mvn compile                    — verify everything compiles"
echo "   2. Implement *ApiDelegate beans   — create @Service classes in src/main/java/${{ values.packagePath }}/"
echo "   3. make run                       — start locally, Swagger UI on http://localhost:8080/swagger-ui.html"
