# WebdriverIO Service Makefile
# Commandes pour l'équipe Plateforme Qualité

# Variables
REGISTRY ?= your-registry.com
IMAGE_NAME = webdriverio-service
VERSION ?= 1.0.0
PLATFORMS = linux/amd64,linux/arm64

# Colors pour output
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: help
help: ## Afficher cette aide
	@echo "$(GREEN)WebdriverIO Service - Commandes disponibles$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}'

.PHONY: build
build: ## Construire l'image Docker localement
	@echo "$(GREEN)Building $(IMAGE_NAME):$(VERSION)...$(RESET)"
	docker build -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .
	@echo "$(GREEN)Build complete!$(RESET)"

.PHONY: build-multi
build-multi: ## Construire pour multi-plateformes (Mac M1/Intel, Linux)
	@echo "$(GREEN)Building multi-platform image...$(RESET)"
	docker buildx build \
		--platform $(PLATFORMS) \
		-t $(IMAGE_NAME):$(VERSION) \
		-t $(IMAGE_NAME):latest \
		.
	@echo "$(GREEN)Multi-platform build complete!$(RESET)"

.PHONY: test
test: build ## Construire et tester l'image localement
	@echo "$(GREEN)Testing image with example project...$(RESET)"
	cd examples/minimal-project && docker-compose up --abort-on-container-exit wdio-tests
	@echo "$(GREEN)Tests passed!$(RESET)"

.PHONY: test-shell
test-shell: build ## Ouvrir un shell dans le container pour debug
	@echo "$(GREEN)Opening shell in container...$(RESET)"
	docker run --rm -it \
		-v $(PWD)/examples/minimal-project/tests:/tests/tests \
		$(IMAGE_NAME):latest bash

.PHONY: tag
tag: ## Tagger l'image pour le registry
	@echo "$(GREEN)Tagging image for registry...$(RESET)"
	docker tag $(IMAGE_NAME):$(VERSION) $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker tag $(IMAGE_NAME):$(VERSION) $(REGISTRY)/$(IMAGE_NAME):latest
	@echo "$(GREEN)Tagged as:$(RESET)"
	@echo "  - $(REGISTRY)/$(IMAGE_NAME):$(VERSION)"
	@echo "  - $(REGISTRY)/$(IMAGE_NAME):latest"

.PHONY: push
push: tag ## Pousser l'image vers le registry
	@echo "$(GREEN)Pushing to registry...$(RESET)"
	docker push $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker push $(REGISTRY)/$(IMAGE_NAME):latest
	@echo "$(GREEN)Push complete!$(RESET)"

.PHONY: push-multi
push-multi: ## Construire et pousser multi-plateformes en une commande
	@echo "$(GREEN)Building and pushing multi-platform image...$(RESET)"
	docker buildx build \
		--platform $(PLATFORMS) \
		--push \
		-t $(REGISTRY)/$(IMAGE_NAME):$(VERSION) \
		-t $(REGISTRY)/$(IMAGE_NAME):latest \
		.
	@echo "$(GREEN)Multi-platform push complete!$(RESET)"

.PHONY: release
release: test tag push ## Processus complet de release (test + tag + push)
	@echo "$(GREEN)Release $(VERSION) complete!$(RESET)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(RESET)"
	@echo "  1. Update CHANGELOG.md"
	@echo "  2. Git tag: git tag -a v$(VERSION) -m 'Release $(VERSION)'"
	@echo "  3. Git push: git push origin v$(VERSION)"
	@echo "  4. Communicate to teams"

.PHONY: scan
scan: build ## Scanner l'image pour vulnérabilités (nécessite trivy)
	@echo "$(GREEN)Scanning image for vulnerabilities...$(RESET)"
	@command -v trivy >/dev/null 2>&1 || { echo "$(YELLOW)trivy not found. Install: https://aquasecurity.github.io/trivy/$(RESET)"; exit 1; }
	trivy image --severity HIGH,CRITICAL $(IMAGE_NAME):$(VERSION)

.PHONY: inspect
inspect: build ## Inspecter l'image (layers, taille, etc.)
	@echo "$(GREEN)Image information:$(RESET)"
	@docker images $(IMAGE_NAME):$(VERSION) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
	@echo ""
	@echo "$(GREEN)Image layers:$(RESET)"
	@docker history $(IMAGE_NAME):$(VERSION) --no-trunc

.PHONY: clean
clean: ## Nettoyer les images locales
	@echo "$(GREEN)Cleaning local images...$(RESET)"
	docker rmi $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest || true
	@echo "$(GREEN)Clean complete!$(RESET)"

.PHONY: clean-all
clean-all: clean ## Nettoyer images et résultats de tests
	@echo "$(GREEN)Cleaning test results...$(RESET)"
	rm -rf examples/minimal-project/test-results/*
	rm -rf examples/minimal-project/allure-results/*
	@echo "$(GREEN)All clean!$(RESET)"

.PHONY: bump-patch
bump-patch: ## Incrémenter version PATCH (x.x.1 → x.x.2)
	@echo "$(GREEN)Bumping patch version...$(RESET)"
	@# Cette commande nécessite le script bump-version.sh
	@./scripts/bump-version.sh patch

.PHONY: bump-minor
bump-minor: ## Incrémenter version MINOR (x.1.x → x.2.0)
	@echo "$(GREEN)Bumping minor version...$(RESET)"
	@./scripts/bump-version.sh minor

.PHONY: bump-major
bump-major: ## Incrémenter version MAJOR (1.x.x → 2.0.0)
	@echo "$(GREEN)Bumping major version...$(RESET)"
	@./scripts/bump-version.sh major

.PHONY: version
version: ## Afficher la version actuelle
	@echo "$(GREEN)Current version:$(RESET) $(VERSION)"
	@echo "$(GREEN)Registry:$(RESET) $(REGISTRY)"
	@echo "$(GREEN)Image:$(RESET) $(REGISTRY)/$(IMAGE_NAME):$(VERSION)"

.PHONY: example
example: build ## Lancer l'exemple de projet
	@echo "$(GREEN)Running example project...$(RESET)"
	cd examples/minimal-project && docker-compose up wdio-tests

# Commandes utiles pour développement
.PHONY: dev
dev: ## Mode développement avec live reload
	@echo "$(GREEN)Starting development mode...$(RESET)"
	docker run --rm -it \
		-v $(PWD)/examples/minimal-project/tests:/tests/tests \
		-v $(PWD)/examples/minimal-project/test-results:/tests/test-results \
		-v $(PWD)/config:/tests/config \
		-e HEADLESS=false \
		$(IMAGE_NAME):latest bash

.PHONY: logs
logs: ## Voir les logs de l'exemple
	cd examples/minimal-project && docker-compose logs -f wdio-tests
