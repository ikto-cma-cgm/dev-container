# Liquibase migrations skeleton

Pre-assembled Liquibase migrations module used by the `springboot-liquibase-composition-template`.

## What this skeleton provides

A starter set of Liquibase changelogs and migration scripts that get scaffolded
alongside the Spring Boot service:

- `db-changelog.xml` — master changelog (entry point read by Liquibase)
- `src/001_scripts/` — first migration: SQL DDL + Liquibase XML wrapper

When the composite template runs, the contents of this directory are copied
into `${service}/src/main/resources/db/migration/` of the generated repository
(see the `fetch-liquibase-skeleton` step in `template.yaml`).

## Catalog placement

This skeleton is registered as a `Resource` (kind `liquibase`, type `liquibase`)
dependent on the Spring Boot `Component`. The entity declaration lives in the
multi-document `skeleton-app/catalog-info.yaml` at the repository root, not in
this directory — the local `catalog-info.yaml` is a stub for linter compliance
only (see its header for details).

## Ownership

Owner: `group:default/it-development-software-engineering-developer-platform`

This is the Developer Platform team. Same ownership as the parent composite
template and the Spring Boot skeleton.

## Versioning & lifecycle

This skeleton follows ADR-0001:

- **R1 — SemVer**: version is tracked on the parent composite template, not on
  individual skeleton-*/ modules.
- **R3 — Lifecycle**: `experimental`.
- **R4 — Ownership**: Developer Platform team (above).

## Customising migrations

After scaffolding, edit:

- `db-changelog.xml` to include additional migration directories
- `001_scripts/` (or add `002_*`, `003_*`, ...) for new migrations

Follow the
[Liquibase XML changelog reference](https://docs.liquibase.com/concepts/changelogs/xml-format.html)
for syntax.
