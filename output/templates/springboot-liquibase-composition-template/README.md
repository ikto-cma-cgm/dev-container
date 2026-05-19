# Spring Boot + Liquibase Composition Template

Scaffolds a Spring Boot microservice together with Liquibase migrations in a single repository.

## Purpose

This **composite template** delivers a complete Spring Boot service with Liquibase migrations as a single scaffold:
- Pre-assembled Spring Boot application skeleton (`skeleton-app/`) — Maven project, Dockerfile, application config, CI pipeline
- Backstage entities — `kind: Component` (the service) + `kind: Resource` (the Liquibase database asset) in a multi-document `catalog-info.yaml`
- Component → Resource relationship via `dependsOn`
- TechDocs scaffolding

## Composition strategy — Option C (pre-assembled skeleton)

This composite follows **Option C** of the MVP plan: a single `skeleton-app/` containing the assembled union of what a Spring Boot service with Liquibase migrations needs, with Jinja2 conditionals for the database flavor (PostgreSQL / Oracle).

The composite **does not consume the unit templates** (`springboot-service-template`, `liquibase-service-template`) at scaffold time. They evolve in parallel, and the composite's `skeleton-app/` represents an opinionated assembly. This is a Phase 1 trade-off, consistent with the consolidated MVP plan. Phase 2 (runtime composition via `fetch:template@vX.Y.Z`) is deferred.

## Usage

This template is consumed via the Backstage Developer Portal. Navigate to **Create → Spring Boot + Liquibase Composition** and fill in the form.

## Ownership

- **Owner**: `group:default/it-development-software-engineering-developer-platform` (Developer Portal Team)
- **Maintainers**: Developer Portal Team members. Pull requests welcome via the repository's standard review process.
- **Support**: open an issue on the repository, or reach out to the Developer Portal Team channel.
- **Contribution**: changes must pass the R01–R19 lint check (`./scripts/lint.sh output/templates/springboot-liquibase-composition-template/`). Breaking changes follow Semantic Versioning — see `CHANGELOG.md`.

## Compliance with ADR-0001 Composable Service Governance

| Rule | Status | Notes |
|---|---|---|
| **R1** SemVer | ✅ See `CHANGELOG.md` and Git tags (`v<MAJOR>.<MINOR>.<PATCH>`) |
| **R2** Pinning | N/A (Option C — pre-assembled skeleton, no runtime fetch of unit templates) |
| **R3** Lifecycle | ✅ Generated Component and Resource use `lifecycle: experimental` |
| **R4** Ownership | ✅ This section + `CHANGELOG.md` |
| **R5** Cascade | N/A (Option C — no cascade from unit templates) |

## Linter status

Latest run: **14/19 passed, 5 skipped**. The 5 skipped rules (R12–R16) target a strict `skeleton/` directory; this composite uses `skeleton-app/` (Option C convention), which the current linter does not recognize as a scaffolding directory. Tracked as F10 — linter enhancement to support `skeleton-*/` glob (out of scope for this template).

## Notes

- Currently scaffolds to GitHub (`publish:github`). Migration to GitLab CMA planned — see the form's "GitLab Information" section which captures parameters for future migration but does not currently drive the scaffolder steps.
- `skeleton-liquibase/` directory exists alongside `skeleton-app/` but is not currently fetched by any step. Pending decision: integrate via an additional `fetch:template` step or remove (tracked as F7).

## Related

- ADR-0001 — Composable Service Governance
- SMT-93 — User Story this template materializes ("As a service provider, I want to create a composable service")
- SMT-99 — Composable Service standards (TechDocs in `backstage-documentation` repo)
- `springboot-service-template`, `liquibase-service-template` — unit templates that this composite logically subsumes
