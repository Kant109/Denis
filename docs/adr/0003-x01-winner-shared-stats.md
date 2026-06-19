# ADR 0003 — Écran X01Winner basé sur des stats réutilisables

## Statut
Accepté — 2026-06-19

## Contexte
L’écran `X01Winner` affichait surtout le profil du gagnant, sans modèle de stats global de match.
Le besoin produit est double:
- afficher un récap de fin de partie complet,
- rendre ces stats réutilisables dans d’autres écrans et via backend.

## Décision
Créer un objet métier `X01MatchStats` construit à partir de l’historique d’événements X01 (`games`) et le conserver dans le store en fin de match.

Règles:
1. Le calcul des stats match se base prioritairement sur les événements `end_leg` pour éviter de doubler le leg final (`end_leg` + `end_match`).
2. Le snapshot `end_match` sert de référence finale (sets/legs/gagnant).
3. `X01Winner` lit `matchStats` depuis le store et n’implémente plus sa propre logique métier de calcul.
4. Le modèle `X01MatchStats` devient le contrat d’échange cible avec le backend.

## Portée
- Frontend Vue/Pinia X01
- Documentation de contrats API Express

## Conséquences
### Positives
- Calcul des stats centralisé et réutilisable
- UI `X01Winner` plus simple et orientée présentation
- Base prête pour persistance backend et analytics

### Négatives
- Nouveau contrat à maintenir (frontend/backend)
- Dépendance explicite au modèle événementiel existant

## Critères d’acceptation
- En fin de match, `matchStats` est disponible dans le store.
- `X01Winner` affiche un résumé match et un classement joueur via `matchStats`.
- Le contrat API est documenté pour implémentation Express.
