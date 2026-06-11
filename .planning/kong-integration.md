# Plan : Intégration Kong API Gateway

## Contexte

Permettre l'enregistrement d'un service sur Kong depuis Backstage — unitairement via un template dédié, et comme brique composable réutilisable dans les templates futurs.

## Périmètre (court terme)

Le pré-enregistrement au scaffolding a été écarté : Kong ne doit être enregistré qu'**après** le déploiement réel du service, avec une URL d'upstream connue.

## Ce qui est implémenté

### 1. Action scaffolder `cma:kong:register-service`

**Fichiers :**
- `backstage/backstage-app/packages/backend/src/modules/kong/kongRegisterAction.ts`
- `backstage/backstage-app/packages/backend/src/modules/kong/index.ts`
- Enregistrée dans `packages/backend/src/index.ts`

**Comportement :**
- `PUT /services/{name}` — upsert idempotent du Kong Service
- `PUT /routes/{name}-route` — upsert idempotent de la Route (`/api/{name}/*`, strip_path: false)
- Upstream par défaut : `http://{serviceName}:8080`
- Config : `cma.kongAdminUrl` lu depuis app-config

### 2. Template standalone `kong-register-service`

**Fichier :** `templates/kong-register-service-template/template.yaml`

**Usage :** Post-déploiement uniquement. L'utilisateur sélectionne un Component Backstage existant et renseigne optionnellement l'URL upstream réelle.

**Enregistré dans :** `templates/catalog.yaml`

### 3. Configuration par profil

| Profil | Fichier | `cma.kongAdminUrl` |
|---|---|---|
| Local dev | `backstage/app-config.yaml` | `http://localhost:8001` |
| Docker dev | `backstage/app-config.docker-dev.yaml` | `http://kong:8001` |
| Docker prod | `backstage/app-config.docker-prod.yaml` | `http://kong:8001` |

### 4. Docker Compose

Services ajoutés dans `backstage/docker-compose.yml` :
- `kong-database` (PostgreSQL 16)
- `kong-migration` (bootstrap one-shot)
- `kong` (gateway 3.9, ports 8000/8443/8001/8444)

Variable d'environnement : `KONG_DB_PASSWORD` (défaut : `kongpassword`)

## Ce qui est hors périmètre (moyen terme)

- Enregistrement automatique dans le CI/CD du service après déploiement
- Plugins Kong (rate limiting, auth)
- Card Kong sur la page entité du Catalog (bouton "Register on Kong")
- Sécurisation de l'Admin API

## Flux d'utilisation

```
1. Créer le service via springboot-openapi-codegen-template
2. Déployer le service (CI/CD, docker, etc.)
3. Backstage → Create → "Register Service on Kong API Gateway"
4. Sélectionner le Component → renseigner l'URL upstream réelle
5. Tester : curl http://localhost:8000/api/{name}/actuator/health
```
