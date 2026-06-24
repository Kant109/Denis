import type { X01MatchStats, X01PlayerStats } from "@/interfaces/X01MatchStatsInterface";

export type X01PersistedMatchResponse = {
    matchId: string,
    stats: X01MatchStats,
}

export function useX01StatsApi() {
    const baseUrl = `${import.meta.env.VITE_BE_URL}`;

    async function requestJson<T>(path: string, init?: RequestInit, errorPrefix?: string): Promise<T> {
        const response = await fetch(`${baseUrl}${path}`, init);

        if (!response.ok) {
            let details = '';

            try {
                const contentType = response.headers.get('content-type') ?? '';
                if (contentType.includes('application/json')) {
                    const data = await response.json() as { message?: string; error?: string };
                    details = data.message ?? data.error ?? '';
                } else {
                    details = (await response.text()) || '';
                }
            } catch {
                details = '';
            }

            const suffix = details ? ` - ${details}` : '';
            throw new Error(`${errorPrefix ?? 'Erreur API X01'} (${response.status})${suffix}`);
        }

        return response.json() as Promise<T>;
    }

    async function saveMatchStats(stats: X01MatchStats): Promise<X01PersistedMatchResponse> {
        return requestJson<X01PersistedMatchResponse>('/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stats),
        }, 'Impossible de sauvegarder les stats X01');
    }

    async function getAllMatchStats(): Promise<Array<X01PersistedMatchResponse>> {
        return requestJson<Array<X01PersistedMatchResponse>>('/matches', undefined, 'Impossible de charger les stats X01');
    }

    async function getMatchStats(matchId: string): Promise<X01PersistedMatchResponse> {
        return requestJson<X01PersistedMatchResponse>(`/matches/${matchId}`, undefined, 'Impossible de charger les stats du match X01');
    }

    async function getPlayerStats(playerId: string): Promise<X01PlayerStats> {
        return requestJson<X01PlayerStats>(`/players/${playerId}/stats`, undefined, 'Impossible de charger les stats X01 du joueur');
    }

    return {
        saveMatchStats,
        getAllMatchStats,
        getMatchStats,
        getPlayerStats,
    };
}
