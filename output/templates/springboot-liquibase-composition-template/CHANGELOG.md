# Changelog

All notable changes to this template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this template adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) per ADR-0001 Rule R1.

## [0.2.0] - 2026-06-02

### Added
- Top-level `kind: System` entry in the generated `catalog-info.yaml`, grouping the Component and the Liquibase Resource — satisfies composable standard C02 (System-level catalog entry) and lets each Component's `spec.system` resolve (C03).

### Notes
- **Option C deviation on C01:** skeletons are vendored locally (`skeleton-app/`, `skeleton-liquibase/`), so there is no remote `fetch:template` to pin. C01 (pinned skeleton refs) is therefore N/A for this Phase-1 variant; it applies in Phase 2 when skeletons are fetched remotely by version. C02-C05 apply and pass.
- A new SemVer tag `springboot-liquibase-composition-template/v0.2.0` should be cut for this release.

## [0.1.0] - 2026-06-01

### Added
- Initial composite implementation following MVP plan Option C (pre-assembled `skeleton-app/` with Jinja2 conditionals on the database flavor).
- Multi-document `catalog-info.yaml` registering both the Spring Boot Component and the Liquibase Resource in a single `catalog:register` step (commit `479be97`).
- Catalog ownership documentation (this CHANGELOG + README Ownership section) — ADR-0001 R4.
- `skeleton-liquibase/` integrated via `fetch:template` step (F7 resolved).

### Changed
- Generated `catalog-info.yaml` and `liquibase-catalog-info.yaml` cleaned: removed invalid `spec.domain` field on Component and Resource (commit `c550835`).
- "GitLab Information" form section: `architectureArea` and `gitlabNamespace` switched from required to optional, as they are reserved for the future GitLab CMA migration and currently not consumed by the steps (commit `c550835`).

### Notes
- Currently scaffolds to GitHub (`publish:github`). Migration to GitLab CMA planned.
- Composite operates in **Option C** (pre-assembled skeleton). Phase 2 (runtime composition via `fetch:template@vX.Y.Z`) deferred — see consolidated MVP plan.
