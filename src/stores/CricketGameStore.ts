import { defineStore } from "pinia";
import { ref } from "vue";

export const useCricketGameStore = defineStore('CricketGame', () => {
    const players = ref([] as Array<CricketPlayer>);
    const isGameFinish = ref(false);
    const winnerPlayer = ref({} as CricketPlayer);
    const gameId = ref(0);

    function reset() {
        players.value = [];
        isGameFinish.value = false;
        winnerPlayer.value = {} as CricketPlayer;
        gameId.value = 0;
    }

    return { players, isGameFinish, winnerPlayer, gameId, reset };
})