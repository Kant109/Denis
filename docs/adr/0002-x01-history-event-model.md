# ADR 0002 — Modèle d’événements pour l’historisation X01

## Statut
Accepté — 2026-06-19

## Contexte
La première approche historisait uniquement les fins de leg dans `games`.
Le besoin produit est désormais de tracer explicitement les deux moments métier:
- fin de leg
- fin de match

et de les exploiter dans l’UI de la vue de jeu X01.

## Décision
Adopter un modèle d’historique orienté événements avec deux types:
- `end_leg`
- `end_match`

Règles:
1. À chaque checkout valide d’un leg, créer un événement `end_leg`.
2. Si ce leg clôture aussi le match, créer ensuite un événement `end_match`.
3. Chaque événement embarque un snapshot complet des joueurs (copie immuable, incluant les `volleys`).
4. L’UI X01 affiche l’historique complet (non limité), du plus récent au plus ancien.

## Portée
- Frontend uniquement
- Store Pinia X01 + UI `X01Game`
- Persistance mémoire session

## Conséquences
### Positives
- Traçabilité métier explicite (leg vs match)
- Historique robuste aux mutations de l’état live
- Base claire pour analytics futures

### Négatives
- Deux entrées sur leg final (volontaire)
- Schéma actuel à faire évoluer si besoin de métadonnées additionnelles (timestamp, mode cible, etc.)

## Critères d’acceptation
- Un leg terminé crée un `end_leg`.
- Un match terminé crée un `end_match`.
- Le leg final qui termine le match produit 2 entrées ordonnées `end_leg` puis `end_match`.
- Le reset de partie n’altère pas les entrées déjà historisées.
- L’UI `X01Game` affiche l’historique dans l’ordre décroissant de récence.

## Supersession
Supersède `docs/adr/0001-x01-finished-games-history.md`.
