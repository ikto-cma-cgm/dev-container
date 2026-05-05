# ${{ values.name }}

${{ values.description }}

## Stack Technique

- **Go 1.21+** — Langage avec modules natifs
- **Gin** — HTTP framework rapide et léger
- **slog** — Structured logging natif (Go 1.21+)
- **Viper** — Configuration via env vars et fichiers
- **Health checks** — Endpoints `/health` et `/ready`
- **testing** — Tests unitaires avec le package standard

## Démarrer

```bash
go mod download
go run cmd/main.go
```

Le serveur démarre sur `http://localhost:8080`.

## Scripts Disponibles

| Commande | Description |
|---|---|
| `go run cmd/main.go` | Démarrer le serveur |
| `go test ./...` | Exécuter tous les tests |
| `go test -cover ./...` | Tests avec coverage |
| `golangci-lint run` | Linter le code Go |
| `go vet ./...` | Analyse statique |
| `go build -o bin/${{ values.name }} ./cmd` | Build binaire |

## Structure du Projet

```
cmd/
├── main.go            # Point d'entrée
internal/
├── config/            # Configuration et chargement env
├── handler/           # HTTP handlers
├── service/           # Business logic
├── middleware/        # Middleware Gin (auth, logging, recovery)
├── model/             # Modèles de données
└── health/            # Health check handlers
pkg/                   # Bibliothèques réutilisables
tests/                 # Integration tests
```

## Conventions

- **Handlers** : Net/http style, un handler par endpoint
- **Service layer** : Isolation de la logique métier des handlers HTTP
- **Logging** : `slog` avec context, jamais de `fmt.Println`
- **Errors** : Retourner les erreurs, ne pas les ignorer (`_` uniquement en tests)
- **Nommage** : `PascalCase` pour les exports, `camelCase` pour le privé
- **Tests** : Table-driven tests dans chaque package, nom `*_test.go`
- **Config** : Variables d'environnement avec fallbacks, prefix service
