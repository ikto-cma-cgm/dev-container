# ${{ values.name }}

${{ values.description }}

## Stack Technique

- **React 19** — UI library
- **TypeScript** — Typage statique
- **Vite** — Build tool et dev server
- **Tailwind CSS** — Utility-first styling
- **React Router v7** — Client-side routing
- **TanStack Query v5** — Server state management
- **Vitest + Testing Library** — Unit et integration tests
- **ESLint + Prettier** — Linting et formatage

## Démarrer

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Scripts Disponibles

| Script | Description |
|---|---|
| `npm run dev` | Dev server avec HMR |
| `npm run build` | Build pour production |
| `npm run preview` | Preview du build local |
| `npm test` | Exécuter les tests |
| `npm run lint` | Linter le code |
| `npm run typecheck` | Vérifier les types TypeScript |
| `npm run format` | Formater le code avec Prettier |

## Structure du Projet

```
src/
├── components/    # Composants UI réutilisables
├── pages/         # Pages par route
├── hooks/         # Custom React hooks
├── utils/         # Utilitaires
├── styles/        # Styles globaux
├── App.tsx        # Composant racine + routes
└── main.tsx       # Point d'entrée
```

## Conventions

- **Composants** : Functional components avec TypeScript interfaces
- **Nommage** : PascalCase pour les composants, kebab-case pour les fichiers
- **Hooks personnalisés** : préfixés par `use`
- **Tailwind** : Préféré pour tout le styling
- **Tests** : Un test par composant/page dans `tests/`
