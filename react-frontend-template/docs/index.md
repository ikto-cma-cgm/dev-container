# React Frontend Template

Template pour cr&eacute;er une application React 19 frontend avec une stack moderne et des standards CMA CGM.

## Stack

- **React 19** — UI library avec concurrent features
- **TypeScript** — Typage strict (`strict: true`)
- **Vite 6** — Build ultra-rapide avec HMR
- **Tailwind CSS 3** — Utility-first avec custom brand colors
- **React Router 7** — File-based routing ready
- **TanStack Query 5** — Gestion du server state avec cache, retry, optimisation
- **Vitest + Testing Library** — Tests unitaires rapides avec jsdom

## Pourquoi ces choix

### Vite au lieu de Create React App
- Build 10x plus rapide
- HMR instantan&eacute;
- Native ESM, pas de Webpack config
- Zero-config pour la plupart des cas

### TanStack Query au lieu de Redux
- Less boilerplate pour le server state
- Auto-caching, background refetch, pagination built-in
- Moins de code &agrave; maintenir
- Redux reste disponible pour le client state complexe

### Tailwind CSS
- D&eacute;veloppement plus rapide (pas de context-switching vers les fichiers CSS)
- Bundle size minimal (purge automatique)
- Consistance visuelle avec les custom brand colors
- Responsive design natif

### Vitest au lieu de Jest
- Drop-in replace pour Jest
- Plus rapide (utilise esbuild)
- Compatible avec les imports ESM/Vite
- Coverage out-of-the-box
