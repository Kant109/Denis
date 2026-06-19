# Glossaire — X01 Historique

## Partie terminée
Une partie X01 considérée finie lorsque `isGameFinish` passe à `true` après validation des conditions de sets/legs.

## Snapshot
Copie d’état prise à un instant donné. Ici: copie des joueurs et de leurs volées au moment d’un événement d’historique.

## Historique `games`
Collection en mémoire dans le store X01 contenant les événements d’historisation de la session.

## Événement `end_leg`
Événement émis à chaque fin de leg validée (checkout conforme).

## Événement `end_match`
Événement émis quand les conditions de victoire du match sont atteintes.
Sur le leg final, il suit l’événement `end_leg`.

## Volée (`volley`)
Série de trois lancers stockée comme tableau de chaînes (`Array<string>`).

## Clone profond (partiel)
Copie utilisée pour éviter les mutations de référence:
- objet joueur copié
- tableaux `volleys` copiés
