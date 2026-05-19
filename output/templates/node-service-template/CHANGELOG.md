# Changelog

All notable changes to this template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this template adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) per ADR-0001 Rule R1.

## [Unreleased]

### Added
- Initial template implementation: Node.js project structure, Docker, Backstage `catalog-info.yaml`, TechDocs scaffolding, CI pipeline.
- Catalog ownership documentation (this CHANGELOG + README Ownership section) — ADR-0001 R4.

### Changed
- Generated `catalog-info.yaml` cleaned: removed invalid `spec.domain` field on Component (commit `c550835`).
- Template registered in root `catalog.yaml` so it appears in Backstage local instance (commit `c550835`).

### Notes
- Currently scaffolds to GitHub (`publish:github`). Migration to GitLab CMA planned.
- `kind: Component` generated with `lifecycle: experimental` — ADR-0001 R3.
