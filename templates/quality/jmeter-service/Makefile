# JMeter Load Testing Service - Makefile
# Maintained by: Quality Platform Team

# ===================================
# Configuration
# ===================================

# Docker registry configuration
REGISTRY ?= your-registry.com
IMAGE_NAME := jmeter-service
VERSION ?= 1.0.0

# Multi-platform support (Mac Intel/M1/M2, Linux)
PLATFORMS := linux/amd64,linux/arm64

# Docker buildx builder name
BUILDER := jmeter-builder

# Full image name
IMAGE := $(REGISTRY)/$(IMAGE_NAME)
IMAGE_TAG := $(IMAGE):$(VERSION)
IMAGE_LATEST := $(IMAGE):latest

# Example project path
EXAMPLE_DIR := examples/minimal-project

# ===================================
# Default Target
# ===================================

.PHONY: help
help: ## Show this help message
	@echo "JMeter Service - Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ===================================
# Build Commands
# ===================================

.PHONY: build
build: ## Build Docker image locally
	@echo "Building JMeter service image (local platform)..."
	docker build -t $(IMAGE_NAME):$(VERSION) -t $(IMAGE_NAME):latest .
	@echo "✓ Build complete: $(IMAGE_NAME):$(VERSION)"

.PHONY: build-multi
build-multi: ## Build multi-platform image (AMD64 + ARM64)
	@echo "Building JMeter service image for multiple platforms..."
	@docker buildx create --name $(BUILDER) --use 2>/dev/null || docker buildx use $(BUILDER)
	docker buildx build \
		--platform $(PLATFORMS) \
		-t $(IMAGE_TAG) \
		-t $(IMAGE_LATEST) \
		--load \
		.
	@echo "✓ Multi-platform build complete"

# ===================================
# Test Commands
# ===================================

.PHONY: test
test: build ## Build image and run example tests
	@echo "Running example tests..."
	cd $(EXAMPLE_DIR) && docker-compose up --build --abort-on-container-exit
	@echo "✓ Tests complete. Check $(EXAMPLE_DIR)/reports/index.html for results"

.PHONY: test-shell
test-shell: build ## Open shell in container for debugging
	@echo "Opening interactive shell in JMeter container..."
	docker run -it --rm \
		-v $(PWD)/$(EXAMPLE_DIR)/test-plans:/jmeter/test-plans:ro \
		-v $(PWD)/$(EXAMPLE_DIR)/test-data:/jmeter/test-data:ro \
		$(IMAGE_NAME):$(VERSION) bash

# ===================================
# Registry Commands
# ===================================

.PHONY: tag
tag: ## Tag image for registry
	@echo "Tagging image for registry..."
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_TAG)
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_LATEST)
	@echo "✓ Tagged: $(IMAGE_TAG)"
	@echo "✓ Tagged: $(IMAGE_LATEST)"

.PHONY: push
push: tag ## Push image to registry
	@echo "Pushing image to registry..."
	docker push $(IMAGE_TAG)
	docker push $(IMAGE_LATEST)
	@echo "✓ Pushed to registry"

.PHONY: push-multi
push-multi: ## Build and push multi-platform image
	@echo "Building and pushing multi-platform image..."
	@docker buildx create --name $(BUILDER) --use 2>/dev/null || docker buildx use $(BUILDER)
	docker buildx build \
		--platform $(PLATFORMS) \
		-t $(IMAGE_TAG) \
		-t $(IMAGE_LATEST) \
		--push \
		.
	@echo "✓ Multi-platform image pushed to registry"

# ===================================
# Release Commands
# ===================================

.PHONY: release
release: test tag push ## Full release process (test, tag, push)
	@echo "✓ Release $(VERSION) complete!"

.PHONY: bump-patch
bump-patch: ## Bump patch version (1.0.0 → 1.0.1)
	@echo "Current version: $(VERSION)"
	@echo "Bumping patch version..."
	@# Add version bump logic here

.PHONY: bump-minor
bump-minor: ## Bump minor version (1.0.0 → 1.1.0)
	@echo "Current version: $(VERSION)"
	@echo "Bumping minor version..."
	@# Add version bump logic here

.PHONY: bump-major
bump-major: ## Bump major version (1.0.0 → 2.0.0)
	@echo "Current version: $(VERSION)"
	@echo "Bumping major version..."
	@# Add version bump logic here

# ===================================
# Security & Quality
# ===================================

.PHONY: scan
scan: build ## Security scan with Trivy
	@echo "Scanning image for vulnerabilities..."
	@command -v trivy >/dev/null 2>&1 || { echo "Trivy not installed. Install from https://github.com/aquasecurity/trivy"; exit 1; }
	trivy image --severity HIGH,CRITICAL $(IMAGE_NAME):$(VERSION)
	@echo "✓ Security scan complete"

.PHONY: inspect
inspect: build ## Inspect image layers and size
	@echo "Image information:"
	docker images $(IMAGE_NAME):$(VERSION)
	@echo ""
	@echo "Image history:"
	docker history $(IMAGE_NAME):$(VERSION)

# ===================================
# Development Commands
# ===================================

.PHONY: example
example: build ## Run example project
	@echo "Running example project..."
	cd $(EXAMPLE_DIR) && docker-compose up --build

.PHONY: dev
dev: ## Development mode (auto-rebuild on changes)
	@echo "Starting development mode..."
	cd $(EXAMPLE_DIR) && docker-compose up --build

.PHONY: logs
logs: ## View example project logs
	cd $(EXAMPLE_DIR) && docker-compose logs -f

# ===================================
# Cleanup Commands
# ===================================

.PHONY: clean
clean: ## Remove local images
	@echo "Cleaning local images..."
	docker rmi -f $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest 2>/dev/null || true
	@echo "✓ Cleanup complete"

.PHONY: clean-all
clean-all: clean ## Clean images and test results
	@echo "Cleaning test results..."
	rm -rf $(EXAMPLE_DIR)/results/* $(EXAMPLE_DIR)/reports/* $(EXAMPLE_DIR)/logs/*
	@echo "✓ Deep cleanup complete"

# ===================================
# Information Commands
# ===================================

.PHONY: version
version: ## Display version information
	@echo "JMeter Service Version: $(VERSION)"
	@echo "Registry: $(REGISTRY)"
	@echo "Image: $(IMAGE_TAG)"
	@echo "Platforms: $(PLATFORMS)"

.DEFAULT_GOAL := help
