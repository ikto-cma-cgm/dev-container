# ${{ values.name }}

Documentation pour le service ${{ values.name }}.

## Architecture

Ce service est construit avec :

- Node.js ${{ values.nodeVersion }}
- Framework Node.js
- Docker

## Déploiement

Le déploiement est géré automatiquement par le pipeline CI/CD au premier push sur la branche master.

## Runbook

Consultez le [On-call runbook](https://wiki.cma-cgm.com/${{ values.name }}/runbook) pour les procédures opérationnelles.
