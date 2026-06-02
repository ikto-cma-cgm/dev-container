#!/bin/bash
set -e

# Pour upgrader : https://gitlab.com/gitlab-org/cli/-/releases
GLAB_VERSION="1.99.0"

ARCH=$(dpkg --print-architecture)
URL="https://gitlab.com/gitlab-org/cli/-/releases/v${GLAB_VERSION}/downloads/glab_${GLAB_VERSION}_linux_${ARCH}.deb"

echo "→ Installation de glab v${GLAB_VERSION} (${ARCH})"
curl -fsSL "$URL" -o /tmp/glab.deb
sudo dpkg -i /tmp/glab.deb
rm /tmp/glab.deb

echo "✅ $(glab version) installé"

# Pour upgrader : https://github.com/cli/cli/releases
GH_VERSION="2.74.0"

GH_URL="https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_${ARCH}.deb"

echo "→ Installation de gh v${GH_VERSION} (${ARCH})"
if curl -fsSL --max-time 10 "$GH_URL" -o /tmp/gh.deb 2>/dev/null; then
  sudo dpkg -i /tmp/gh.deb
  rm /tmp/gh.deb
  echo "✅ $(gh version | head -1) installé"

  # L'extension gh-copilot est dépréciée (sept. 2025).
  # Le nouveau GitHub Copilot CLI est un binaire standalone : https://github.com/github/copilot-cli
  echo "→ Installation de GitHub Copilot CLI (nouveau binaire standalone)"
  if curl -fsSL https://gh.io/copilot-install | bash; then
    echo "✅ copilot installé — lance 'copilot' dans un répertoire projet (REPL interactif)"
  else
    echo "⚠️  copilot non installé"
  fi
else
  echo "⚠️  gh non installé (github.com inaccessible depuis ce réseau)"
fi
