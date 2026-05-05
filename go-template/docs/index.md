# Go Service Template

Template pour créer un microservice Go avec Gin, structured logging, health checks et les standards CMA CGM.

## Stack

- **Go 1.21+** — Modules natives, generics, `slog` integrated
- **Gin** — HTTP framework, 40k+ req/s en benchmark
- **slog** — Structured logging natif (Go 1.21+)
- **Viper** — Configuration flexible (env, YAML, JSON)
- **Health checks** — `/health` et `/ready` pour Kubernetes

## Pourquoi ces choix

### Go comme langage backend
- Compilation rapide, binaire unique, pas de runtime à installer
- Concurrency model natif (goroutines, channels)
- Performance proche du C, avec GC et sécurité mémoire
- Écosystème mature, minimal GC pauses

### Gin au lieu de stdlib net/http
- Routing paramétré natif
- Middleware system intégré
- Validation de requête avec binding
- JSON Marshalling rapide (json-iterator)
- Recovery et logging middleware inclus

### slog au lieu de zerolog/structured-log
- Natif dans Go 1.21+, pas de dépendance externe
- Context-based logging
- JSON output par défaut
- Compatible avec les log aggregators (Loki, Datadog)
