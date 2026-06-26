import { defineStore } from "pinia";
import { ref } from "vue";
import { buildX01MatchStats } from "@/common/X01StatsUtils";
import type { X01MatchStats } from "@/interfaces/X01MatchStatsInterface";

export const useX01GameStore = defineStore('X01Game', () => {
    const players = ref([] as Array<X01Player>);
    const isGameFinish = ref(false);
    const winnerPlayer = ref({} as X01Player);
    const mode = ref('301' as '301' | '501');
    const sets= ref(1);
    const legs = ref(1);
    const games = ref([] as Array<X01Game>);
    const matchStats = ref(null as X01MatchStats | null);

    function setPlayer(player: X01Player) {
        players.value.push(player);
    }

    function setIsGameFinish(newIsGameFinish: boolean) {
        isGameFinish.value = newIsGameFinish;
    }

    function setWinner(winner: X01Player) {
        winnerPlayer.value = winner;
    }

    function computeMatchStats() {
        matchStats.value = buildX01MatchStats(
            games.value,
            mode.value,
            sets.value,
            legs.value,
            winnerPlayer.value,
        );
    }

    function addFinishedGame(finishedPlayers: Array<X01Player>, eventType: X01GameEventType = 'end_leg') {
        const playersSnapshot = finishedPlayers.map(player => ({
            ...player,
            volleys: player.volleys.map(volley => [...volley]),
        }));

        games.value.push({
            eventType,
            players: playersSnapshot,
        });
    }

    function registerLegEnd(finishedPlayers: Array<X01Player>) {
        addFinishedGame(finishedPlayers, 'end_leg');
    }

    async function reset() {
        players.value = [];
        isGameFinish.value = false;
        winnerPlayer.value = {} as X01Player;
        mode.value = '301';
        sets.value = 1;
        legs.value = 1;
        games.value = [];
        matchStats.value = null;
    }

    return { players, isGameFinish, winnerPlayer, mode, sets, legs, games, matchStats, setPlayer, setIsGameFinish, setWinner, computeMatchStats, addFinishedGame, registerLegEnd, reset };
})