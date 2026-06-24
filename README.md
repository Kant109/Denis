# Denis Front

Application front-end (Vue 3 + Vite) pour gérer des parties, stats et classements autour de plusieurs modes de jeu, avec un focus actuel sur les fléchettes (`X01` et `Cricket`).

## Objectif du projet

- Proposer une interface simple pour lancer et suivre des parties.
- Afficher les résultats, gagnants et statistiques.
- Fournir une expérience installable sur mobile/desktop via PWA.

## Fonctionnalités principales

- Modes de jeu Fléchettes: `X01` et `Cricket`.
- Gestion des joueurs et affichage des résultats.
- Écrans de ranking et de statistiques.
- Historique de match `X01` basé sur un modèle d'événements (`end_leg`, `end_match`).
- Application web progressive (PWA) avec mise à jour automatique du service worker.

## Stack technique

- `Vue 3` + `TypeScript`
- `Vite`
- `Pinia` (stores)
- `Vue Router`
- `Vitest` (tests)
- `ESLint`
- `vite-plugin-pwa`

## Prérequis

- `Node.js` 20+ recommandé
- `npm`

## Démarrage rapide

1. Installer les dépendances

```bash
npm install
```

2. Créer un fichier `.env` à partir de l'exemple

```bash
cp .env.example .env
```

3. Renseigner les variables d'environnement nécessaires

```dotenv
VITE_BE_URL=YOUR_BACKEND_URL_HERE
VITE_DICEBEAR_SVG_URL="https://api.dicebear.com/9.x/adventurer/svg?seed="
VITE_WS_RECAP_URL=YOUR_WEBSOCKET_RECAP_URL_HERE
```

4. Lancer le serveur de développement

```bash
npm run dev
```

## Scripts utiles

- `npm run dev` : démarre l'application en local.
- `npm run build` : type-check + build de production.
- `npm run preview` : prévisualise le build.
- `npm run type-check` : vérifie les types TypeScript/Vue.
- `npm run test` : lance Vitest en mode watch.
- `npm run test:run` : exécute les tests une seule fois.
- `npm run lint` : lint + correction automatique.

## Structure du projet

- `src/views/` : pages de l'application.
- `src/components/` : composants UI réutilisables.
- `src/stores/` : état global (Pinia).
- `src/composables/` : logique réutilisable (API, WebSocket, utilitaires métier).
- `src/common/` : helpers métier et validation.
- `src/router/` : configuration des routes.

## Déploiement

Le projet est déployable sur `Vercel`.

- La config de rewrite SPA est dans `vercel.json`.
- Un build de production peut être vérifié localement avec:

```bash
npm run build
npm run preview
```

## Notes

- Certaines fonctionnalités liées à `Babykon` existent dans le code mais peuvent être non actives dans le routing actuel.
- L'application est pensée en priorité pour une utilisation simple, rapide et mobile-friendly via la PWA.