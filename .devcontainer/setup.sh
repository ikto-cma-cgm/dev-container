#!/bin/bash
set -e

# Authentifie gh avec GH_TOKEN depuis .env si disponible
if [ -f ".env" ]; then
  GH_TOKEN_VAL=$(grep -E '^GH_TOKEN=' .env | cut -d'=' -f2- | tr -d '"' | tr -d "'")
  if [ -n "$GH_TOKEN_VAL" ]; then
    echo "$GH_TOKEN_VAL" | gh auth login --with-token 2>/dev/null \
      && echo "✅ gh authentifié avec GH_TOKEN" \
      || echo "⚠️  gh auth login échoué (token invalide ?)"
  fi
fi

# Lit le .env et génère ~/.config/opencode/opencode.json
# opencode lit ce fichier automatiquement à chaque lancement — aucune config manuelle nécessaire.
node -e '
  const fs = require("fs"), os = require("os"), path = require("path");

  const env = {};
  if (fs.existsSync(".env")) {
    fs.readFileSync(".env", "utf8").split("\n").forEach(line => {
      const m = line.match(/^([^#=\s][^=]*)=(.*)/);
      if (m) env[m[1].trim()] = m[2].trim();
    });
  }

  const missing = ["AI_API_BASE","AI_API_KEY","AI_MODEL"].filter(k => !env[k]);
  if (missing.length) {
    console.error("⚠️  Variables manquantes dans .env : " + missing.join(", "));
    process.exit(1);
  }

  const confDir = path.join(os.homedir(), ".config", "opencode");
  fs.mkdirSync(confDir, { recursive: true });

  // ~/.config/opencode/opencode.json — lu automatiquement par opencode à chaque lancement.
  // Définit un provider custom "local" via @ai-sdk/openai-compatible (installé dans postCreateCommand).
  const modelId = env.AI_MODEL;
  const conf = {
    "$schema": "https://opencode.ai/config.json",
    provider: {
      local: {
        npm: "@ai-sdk/openai-compatible",
        name: "Local LLM",
        options: {
          baseURL: env.AI_API_BASE,
          apiKey: env.AI_API_KEY
        },
        models: {
          [modelId]: { name: modelId }
        }
      }
    },
    model: "local/" + modelId
  };

  fs.writeFileSync(path.join(confDir, "opencode.json"), JSON.stringify(conf, null, 2) + "\n");
  console.log("✅ opencode configuré — modèle : local/" + modelId + " | base : " + env.AI_API_BASE);

  // Symlinks agents/ versionnés → .opencode/agents/ (project-local, lu par opencode au lancement)
  // + ~/.config/opencode/agents/ (canonique, opencode actuel) + ~/.config/opencode/agent/ (backwards compat).
  const repoAgents = path.join(process.cwd(), "agents");
  if (fs.existsSync(repoAgents)) {
    const agentDir = path.join(process.cwd(), ".opencode", "agents");
    const agentDirs = [
      agentDir,                          // project-local (prioritaire en contexte devcontainer)
      path.join(confDir, "agents"),      // canonique (opencode actuel)
      path.join(confDir, "agent"),       // backwards compat (anciennes versions)
    ];
    agentDirs.forEach(d => fs.mkdirSync(d, { recursive: true }));
    const files = fs.readdirSync(repoAgents);
    for (const file of files) {
      if (file.endsWith(".md")) {
        const src = path.join(repoAgents, file);
        agentDirs.forEach(d => {
          const dst = path.join(d, file);
          try { fs.unlinkSync(dst); } catch (e) { if (e.code !== "ENOENT") throw e; }
          fs.symlinkSync(src, dst, "file");
        });
      }
    }
    console.log("✅ agents symlinked → " + agentDirs.join(", "));
  }
'
