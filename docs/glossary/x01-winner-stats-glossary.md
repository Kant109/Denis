# Glossaire — X01 Winner Stats

## `X01MatchStats`
Résumé métier d’un match X01 finalisé, destiné à l’affichage de fin de partie et à la réutilisation cross-écrans/API.

## `X01PlayerMatchStats`
Ligne de stats par joueur dans un `X01MatchStats` (moyenne, darts lancés, meilleure volée, sets/legs gagnés, etc.).

## `legsPlayed`
Nombre de legs joués dans le match, dérivé des événements `end_leg`.

## `winnerPlayerId`
Identifiant du joueur gagnant porté par le récapitulatif de match.

## Contrat backend X01 stats
Schéma JSON partagé entre frontend et backend pour persister/restituer les statistiques X01.
