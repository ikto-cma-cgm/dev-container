# Submit a Software Template — stub (for DevFactory implementation)

This is a **stub** of the self-service submission action proposed in **ADR-0002 (Software Template end-to-end workflow)** and tracked by **SMT-178**. It defines the contract; DevFactory implements the two custom scaffolder actions concretely.

## What it does (target)

A Service Provider opens this template, provides the URL of their template repository, and the platform:

1. **Validates** the template against the standards (the linter), and
2. on a **green gate only**, **registers** the template in the **UAT template catalogue** (UAT Backstage host, GitLab).

This replaces the EUP ticket on the **submission to UAT** segment only. Promotion from **UAT to production stays a separate, governed step** and is out of scope.

## Two actions to implement

### `cma:template:validate` (gate)
- Input: `repoUrl`.
- Behaviour: pull the repository, run the standards linter (`dev-container/scripts/lint-templates.mjs`: R01-R19 + C01-C05 + ADR-R1/R3), and **fail the step on any error** so registration does not run.
- Output: `reportUrl` (or an inline report).
- Note: reuse the existing linter, do not reimplement the rules.

### `cma:template:register-uat` (registration)
- Input: `repoUrl`, `uatCatalogUrl` (**to be provided by DevFactory**).
- Behaviour: register the template location in the UAT template catalogue on the GitLab UAT host. On success, the template appears in UAT Backstage.
- Note: the existing catalog-time gate `custom-template-validator` (a CatalogProcessor) stays in place as a second line of defence at registration.

## Validate vs Submit

The existing **`Validate My Template`** action stays unchanged and has no side effect (run it at will). **This Submit template is the one with the side effect** (it registers to UAT). Keeping them separate means a template is never published by accident.

## References

- ADR-0002 — Software Template end-to-end workflow (proposed).
- SMT-178 — Self-service software template submission (Validate + Submit to UAT).
- Linter: `dev-container/scripts/lint.sh`, `lint-templates.mjs`.
- Catalog-time gate: `developer-portal/backstage/.../validator/custom-template-validator.ts`.
