# PRD — Historisation événementielle X01

## Problem Statement

Les parties X01 ne fournissent pas un historique métier explicite des moments clés de progression. Les utilisateurs ont besoin d’un historique lisible des fins de leg et de fin de match, afin de revoir la progression d’une partie sans ambiguïté et sans altération après reset.

## Solution

Mettre en place une historisation orientée événements pour X01, avec deux événements métier (`end_leg`, `end_match`) et des snapshots immuables de l’état joueurs. Afficher cet historique dans l’écran de jeu X01 du plus récent au plus ancien, sans limite de cardinalité pour cette itération.

## User Stories

1. En tant que joueur X01, je veux voir chaque fin de leg historisée, afin de suivre la progression manche par manche.
2. En tant que joueur X01, je veux voir explicitement la fin de match historisée, afin d’identifier la conclusion de la partie.
3. En tant qu’utilisateur de l’écran de jeu, je veux que l’historique apparaisse dans la même vue, afin d’éviter de naviguer vers un écran séparé.
4. En tant qu’utilisateur, je veux un ordre du plus récent au plus ancien, afin de voir d’abord les événements les plus pertinents.
5. En tant qu’utilisateur, je veux que le leg final produise aussi l’événement de fin de match, afin de conserver la sémantique complète du domaine.
6. En tant qu’utilisateur, je veux que le reset d’une partie n’altère jamais l’historique déjà capturé, afin de pouvoir consulter un passé fiable.
7. En tant qu’utilisateur, je veux que chaque entrée d’historique reflète l’état complet des joueurs, afin de pouvoir analyser les volées et scores au moment exact de l’événement.
8. En tant que product owner, je veux distinguer les événements `end_leg` et `end_match`, afin de préparer des usages analytics futurs.
9. En tant que développeur, je veux une règle de déclenchement déterministe, afin de réduire les erreurs et les doublons involontaires.
10. En tant que développeur, je veux un modèle en mémoire session pour cette phase, afin de livrer vite sans introduire de persistance long terme.
11. En tant que testeur, je veux des critères d’acceptation explicites sur les cas limites (leg final), afin de valider le comportement attendu.
12. En tant que futur mainteneur, je veux un vocabulaire de domaine aligné (leg/match/événement/snapshot), afin de limiter les ambiguïtés de conception.

## Implementation Decisions

- L’historique suit un modèle événementiel avec deux types: `end_leg` et `end_match`.
- Le déclenchement `end_leg` intervient à chaque checkout valide d’un leg.
- Si un leg termine aussi le match, un `end_match` est émis après `end_leg`.
- Chaque événement transporte un snapshot complet et immuable de l’état joueurs (y compris les volées).
- L’affichage de l’historique est intégré à l’écran de jeu X01.
- L’ordre d’affichage est décroissant en récence.
- La cardinalité d’affichage n’est pas limitée pour cette itération.
- La persistance reste en mémoire session; aucun stockage long terme n’est inclus.
- Le modèle est aligné avec l’ADR active et le glossaire de domaine.

## Testing Decisions

- Un bon test valide le comportement observable métier (événements générés, ordre, intégrité des snapshots), sans assert d’implémentation interne.
- Les tests doivent couvrir: création `end_leg`, création `end_match`, cas du leg final avec double événement, non-altération après reset, rendu UI conditionnel et ordre d’affichage.
- La stratégie privilégie les seams existants les plus hauts: logique de store pour les transitions métier, composant de vue pour le rendu utilisateur.
- Les cas nominaux et limites doivent être testés avec jeux de données minimaux représentatifs (2+ joueurs, progression legs/sets).

## Out of Scope

- Persistance backend/API/base de données.
- Export, filtrage avancé, recherche, pagination ou tri alternatif de l’historique.
- Refonte complète du design de l’écran X01.
- Analytics/telemetry externes.

## Further Notes

- Cette PRD synthétise la décision d’architecture active sur l’historisation X01.
- Le passage à une persistance durable pourra être traité dans une itération dédiée avec ADR complémentaire.
