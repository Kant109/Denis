# CONTEXT — Denis Front

## Domaine X01 (darts)
- Un **leg** est une manche élémentaire gagnée par checkout valide.
- Un **match** est gagné quand un joueur atteint la cible `sets` (et `legs` intermédiaires).
- Le store `X01Game` maintient l’état vivant de la partie (`players`, `isGameFinish`, `winnerPlayer`, `games`).

## Historisation (décision active)
- L’historique est géré sous forme d’**événements**.
- Deux types d’événements sont reconnus:
  - `end_leg`
  - `end_match`
- Sur le leg final qui clôture le match, deux événements sont attendus (`end_leg` puis `end_match`).
- Les snapshots sont immuables (copie des joueurs et volées) pour garantir l’intégrité historique.
- La persistance est **en mémoire session** (pas de stockage long terme demandé).

## UI
- L’historique est affiché dans l’écran `X01Game`.
- Ordre d’affichage: du plus récent au plus ancien.
- Pas de limite de cardinalité pour cette itération.

## Références
- ADR active: `docs/adr/0002-x01-history-event-model.md`
- ADR supersédée: `docs/adr/0001-x01-finished-games-history.md`
