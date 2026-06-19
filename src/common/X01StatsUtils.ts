import type { X01MatchStats, X01PlayerMatchStats } from "@/interfaces/X01MatchStatsInterface";

function parseDartScore(dart: string): number {
    if (dart === '') return 0;

    const normalizedDart = dart.startsWith('O') ? dart.substring(1) : dart;
    const multiplier = normalizedDart.startsWith('T') ? 3 : normalizedDart.startsWith('D') ? 2 : 1;
    const value = parseInt(multiplier === 1 ? normalizedDart : normalizedDart.substring(1), 10);

    return Number.isNaN(value) ? 0 : value * multiplier;
}

function getVolleyScore(volley: Array<string>): number {
    return volley.reduce((accumulator, dart) => accumulator + parseDartScore(dart), 0);
}

function getThrownDartsCount(volleys: Array<Array<string>>): number {
    return volleys.reduce((accumulator, volley) => {
        return accumulator + volley.filter(dart => dart !== '').length;
    }, 0);
}

export function buildX01MatchStats(
    games: Array<X01Game>,
    mode: '301' | '501',
    setsTarget: number,
    legsTarget: number,
    winnerPlayer: X01Player | null,
): X01MatchStats {
    const legEvents = games.filter(game => game.eventType === 'end_leg');
    const sourceEvents = legEvents.length > 0 ? legEvents : games;
    let finalSnapshot: X01Game | undefined;

    for (let index = games.length - 1; index >= 0; index -= 1) {
        if (games[index].eventType === 'end_match') {
            finalSnapshot = games[index];
            break;
        }
    }

    finalSnapshot = finalSnapshot ?? games[games.length - 1];
    const playersFromFinalSnapshot = legEvents.length > 0
        ? legEvents[legEvents.length - 1].players
        : finalSnapshot?.players ?? [];

    const playersAccumulator = new Map<number, X01PlayerMatchStats>();

    playersFromFinalSnapshot.forEach(player => {
        playersAccumulator.set(player.id, {
            playerId: player.id,
            pseudo: player.pseudo,
            firstname: player.firstname,
            name: player.name,
            displayName: `${player.firstname} "${player.pseudo}" ${player.name}`,
            setsWon: player.sets,
            legsWon: player.legs,
            dartsThrown: 0,
            volleysPlayed: 0,
            totalPoints: 0,
            averagePerVolley: 0,
            bestVolley: 0,
            isWinner: false,
        });
    });

    sourceEvents.forEach(game => {
        game.players.forEach(player => {
            if (!playersAccumulator.has(player.id)) {
                playersAccumulator.set(player.id, {
                    playerId: player.id,
                    pseudo: player.pseudo,
                    firstname: player.firstname,
                    name: player.name,
                    displayName: `${player.firstname} "${player.pseudo}" ${player.name}`,
                    setsWon: player.sets,
                    legsWon: player.legs,
                    dartsThrown: 0,
                    volleysPlayed: 0,
                    totalPoints: 0,
                    averagePerVolley: 0,
                    bestVolley: 0,
                    isWinner: false,
                });
            }

            const currentStats = playersAccumulator.get(player.id)!;
            const playerTotalPoints = player.volleys.reduce((accumulator, volley) => accumulator + getVolleyScore(volley), 0);
            const playerBestVolley = player.volleys.reduce((maxScore, volley) => Math.max(maxScore, getVolleyScore(volley)), 0);

            currentStats.totalPoints += playerTotalPoints;
            currentStats.dartsThrown += getThrownDartsCount(player.volleys);
            currentStats.volleysPlayed += player.volleys.length;
            currentStats.bestVolley = Math.max(currentStats.bestVolley, playerBestVolley);
        });
    });

    const winnerPlayerId = winnerPlayer?.id ?? null;
    const playerStats = Array.from(playersAccumulator.values())
        .map(player => ({
            ...player,
            isWinner: player.playerId === winnerPlayerId,
            averagePerVolley: player.volleysPlayed > 0 ? Number((player.totalPoints / player.volleysPlayed).toFixed(2)) : 0,
        }))
        .sort((playerA, playerB) => {
            if (playerA.isWinner !== playerB.isWinner) return playerA.isWinner ? -1 : 1;
            if (playerA.setsWon !== playerB.setsWon) return playerB.setsWon - playerA.setsWon;
            if (playerA.legsWon !== playerB.legsWon) return playerB.legsWon - playerA.legsWon;
            if (playerA.totalPoints !== playerB.totalPoints) return playerB.totalPoints - playerA.totalPoints;
            return playerA.dartsThrown - playerB.dartsThrown;
        });

    return {
        mode,
        setsTarget,
        legsTarget,
        eventsCount: games.length,
        legsPlayed: legEvents.length,
        winnerPlayerId,
        players: playerStats,
    };
}
