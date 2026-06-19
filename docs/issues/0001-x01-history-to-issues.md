# Issues — X01 Historisation événementielle (vertical slices)

## Issue 1 — Modèle d’événement unifié dans le store
**Objectif**
Introduire une structure d’historique qui distingue explicitement `end_leg` et `end_match`.

**Scope**
- Définir le type d’événement d’historique X01.
- Adapter la collection `games` pour stocker des événements typés.
- Garantir la copie immuable du snapshot joueurs.

**Critères d’acceptation**
- Une entrée contient un `eventType` valide (`end_leg` ou `end_match`).
- Le snapshot joueurs ne fuit pas par référence.
- Le typage compile sans régression.

---

## Issue 2 — Émission `end_leg` sur checkout valide
**Objectif**
Créer systématiquement un événement `end_leg` à chaque fin de leg.

**Scope**
- Brancher le déclenchement au point métier de fin de leg.
- Conserver l’ordre naturel des événements.

**Critères d’acceptation**
- Chaque leg terminé génère exactement un `end_leg`.
- Aucun événement `end_leg` n’est créé sur bust/annulation.

---

## Issue 3 — Émission `end_match` à la victoire finale
**Objectif**
Tracer explicitement la fin de match.

**Scope**
- Ajouter le déclenchement `end_match` lorsque les conditions de victoire match sont atteintes.
- Gérer le cas leg final: deux événements ordonnés.

**Critères d’acceptation**
- Victoire match => un `end_match`.
- Sur leg final: ordre strict `end_leg` puis `end_match`.

---

## Issue 4 — UI historique dans l’écran X01Game
**Objectif**
Afficher l’historique dans la vue de jeu X01.

**Scope**
- Rendu conditionnel si historique non vide.
- Tri du plus récent au plus ancien.
- Distinction visuelle du type d’événement.

**Critères d’acceptation**
- Historique vide => aucun panneau.
- Historique non vide => liste complète ordonnée.
- Chaque ligne expose au moins type d’événement + gagnant lisible.

---

## Issue 5 — Tests comportementaux (TDD)
**Objectif**
Sécuriser le comportement métier et UI via tests externes.

**Scope**
- Tests store: `end_leg`, `end_match`, ordre sur leg final, immutabilité snapshot.
- Tests UI: rendu conditionnel, ordre, distinction des types.

**Critères d’acceptation**
- Tous les tests passent.
- Les tests valident uniquement le comportement observable.

---

## Ordre d’exécution recommandé
1. Issue 1
2. Issue 2
3. Issue 3
4. Issue 4
5. Issue 5

## Notes
- Découpage aligné avec ADR 0002 et PRD 0001.
- Format prêt à être transposé en tickets tracker (`ready-for-agent`) quand la config tracker sera disponible.
