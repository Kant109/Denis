# ADR 0001 — Historiser les parties X01 terminées

## Statut
Supersédé par ADR 0002 — 2026-06-19

## Contexte
Le store X01 contient déjà `games`, mais aucune entrée n’était ajoutée lorsqu’une partie se termine.
Le besoin est de conserver un historique des parties précédentes dans la session courante.

## Décision
À chaque fin de leg validée (checkout en double), le store ajoute une entrée dans `games` via `addFinishedGame(finishedPlayers)`.

Chaque entrée stocke:
- Un snapshot complet des joueurs (`X01Player[]`)
- Les `volleys` copiés en profondeur (clone des tableaux internes)

Ce choix évite que les resets de la partie suivante modifient l’historique déjà enregistré.

## Portée
- Historique en mémoire Pinia uniquement (pas de persistance `localStorage`)
- Historisation à chaque fin de leg (donc le dernier leg est également historisé)

## Conséquences
### Positives
- Historique fiable des parties terminées
- Implémentation simple et localisée
- Pas d’effet de bord avec les mutations ultérieures des joueurs

### Négatives
- Historique perdu au refresh
- Pas de métadonnées (date, mode, winner dédié) dans `X01Game` pour l’instant

## Alternatives considérées
1. **Stockage minimal winner/score**
   - Rejeté: insuffisant pour rejouer/analyser les volées.
2. **Persistance localStorage**
   - Rejeté pour l’instant: hors besoin immédiat.

## Implémentation liée
- Store: `src/stores/X01GameStore.ts` (`addFinishedGame`)
- Trigger fin de partie: `src/components/X01/X01Board.vue`
