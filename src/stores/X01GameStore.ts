import { defineStore } from "pinia";
import { ref } from "vue";

export const useX01GameStore = defineStore('X01Game', () => {
    const players = ref([] as Array<X01Player>);
    const isGameFinish = ref(false);
    const winnerPlayer = ref({} as X01Player);
    const mode = ref('301' as '301' | '501');
    const sets= ref(1);
    const legs = ref(1);

    function setPlayer(player: X01Player) {
        players.value.push(player);
    }

    function setIsGameFinish(newIsGameFinish: boolean) {
        isGameFinish.value = newIsGameFinish;
    }

    function setWinner(winner: X01Player) {
        winnerPlayer.value = winner;
    }

    function reset() {
        players.value = [];
        isGameFinish.value = false;
        winnerPlayer.value = {} as X01Player;
        mode.value = '301';
        sets.value = 1;
        legs.value = 1;
    }

    return { players, isGameFinish, winnerPlayer, mode, sets, legs, setPlayer, setIsGameFinish, setWinner, reset };
})