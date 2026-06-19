# PRD — Routes API Express pour stats X01

## Objectif
Permettre au frontend de persister et réutiliser les stats de fin de match X01 (`X01MatchStats`) dans d’autres écrans.

## Contrat partagé

Le payload principal est `X01MatchStats`:
- `mode`: `301 | 501`
- `setsTarget`, `legsTarget`
- `eventsCount`, `legsPlayed`
- `winnerPlayerId`
- `players[]` (`X01PlayerMatchStats`)

## Routes à implémenter (Express)

### `POST /api/x01/matches`
Crée un enregistrement de match X01.

Request body:
```json
{
  "stats": {
    "mode": "301",
    "setsTarget": 2,
    "legsTarget": 3,
    "eventsCount": 7,
    "legsPlayed": 4,
    "winnerPlayerId": 12,
    "players": []
  }
}
```

Response `201`:
```json
{
  "matchId": "x01_20260619_001",
  "stats": {}
}
```

### `GET /api/x01/matches/:matchId`
Retourne le détail d’un match X01.

Response `200`:
```json
{
  "matchId": "x01_20260619_001",
  "stats": {}
}
```

### `GET /api/x01/players/:playerId/matches`
Retourne l’historique des matchs X01 d’un joueur.

Response `200`:
```json
[
  {
    "mode": "501",
    "setsTarget": 1,
    "legsTarget": 5,
    "eventsCount": 6,
    "legsPlayed": 5,
    "winnerPlayerId": 8,
    "players": []
  }
]
```

## Décisions d’implémentation backend

- Valider strictement le schéma `stats` en entrée (zod/joi recommandé).
- Stocker les sous-documents `players` pour éviter des jointures lourdes au rendu du winner/history.
- Index recommandés:
  - `matchId` unique
  - `players.playerId`

## Hors scope

- Pagination/filtrage avancé
- Agrégats globaux (leaderboard) en temps réel
- Gestion ELO ou rating cross-mode
