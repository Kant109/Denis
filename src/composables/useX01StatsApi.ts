import type { X01MatchStats } from "@/interfaces/X01MatchStatsInterface";

type X01PersistedMatchResponse = {
    matchId: string,
    stats: X01MatchStats,
}

export function useX01StatsApi() {
    const baseUrl = `${import.meta.env.VITE_BE_URL}/api/x01`;

    async function saveMatchStats(stats: X01MatchStats): Promise<X01PersistedMatchResponse> {
        const response = await fetch(`${baseUrl}/matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stats }),
        });

        if (!response.ok) {
            throw new Error(`Impossible de sauvegarder les stats X01 (${response.status})`);
        }

        return response.json();
    }

    async function getMatchStats(matchId: string): Promise<X01PersistedMatchResponse> {
        const response = await fetch(`${baseUrl}/matches/${matchId}`);

        if (!response.ok) {
            throw new Error(`Impossible de charger les stats du match X01 (${response.status})`);
        }

        return response.json();
    }

    async function getPlayerStats(playerId: number): Promise<Array<X01MatchStats>> {
        const response = await fetch(`${baseUrl}/players/${playerId}/matches`);

        if (!response.ok) {
            throw new Error(`Impossible de charger les matchs X01 du joueur (${response.status})`);
        }

        return response.json();
    }

    return {
        saveMatchStats,
        getMatchStats,
        getPlayerStats,
    };
}
