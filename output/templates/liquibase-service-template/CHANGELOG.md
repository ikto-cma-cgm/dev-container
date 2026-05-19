# Changelog

All notable changes to this template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this template adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) per ADR-0001 Rule R1.

## [Unreleased]

### Added
- Initial template implementation: Liquibase changelog structure, XL Deploy manifest, CI pipeline, Backstage `catalog-info.yaml`, TechDocs scaffolding.
- Catalog ownership documentation (this CHANGELOG + README Ownership section) — ADR-0001 R4.

### Changed
- Skeleton entity changed from `kind: Resource` to `kind: Component` for catalog visibility (commit `b3032d0`). Semantic debate ongoing — see README Notes section.
- `apiVersion` corrected from `backstage.io/v1beta3` to `scaffolder.backstage.io/v1beta3` (commit `779295b`).
- Generated `catalog-info.yaml` cleaned: removed invalid `spec.domain` field on Component (commit `c550835`).

### Notes
- Currently scaffolds to GitHub (`publish:github`). Migration to GitLab CMA planned.
- `kind: Component` generated with `lifecycle: experimental` — ADR-0001 R3.
