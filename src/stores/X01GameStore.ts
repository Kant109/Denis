import { defineStore } from "pinia";
import { ref } from "vue";

export const useX01GameStore = defineStore('X01Game', () => {
    const players = ref([] as Array<X01Player>);
    const isGameFinish = ref(false);
    const winnerPlayer = ref({} as X01Player);
    const mode = ref('301' as '301' | '501');
    const sets= ref(1);
    const legs = ref(1);
    const games = ref([] as Array<X01Game>)

    function setPlayer(player: X01Player) {
        players.value.push(player);
    }

    function setIsGameFinish(newIsGameFinish: boolean) {
        isGameFinish.value = newIsGameFinish;
    }

    function setWinner(winner: X01Player) {
        winnerPlayer.value = winner;
    }

    function saveGame() {
        games.value.push({
            stats: players.value.map(player => ({
                player: player,
                points: player.points,
                volleys: player.volleys,
                sets: player.sets,
                legs: player.legs,
                average: player.average,
                nbThrows: player.nbThrows,
                nbDarts: player.nbDarts,
            }))
        });
    }

    function reset() {
        players.value = [];
        isGameFinish.value = false;
        winnerPlayer.value = {} as X01Player;
        mode.value = '301';
        sets.value = 1;
        legs.value = 1;
    }

    return { players, isGameFinish, winnerPlayer, mode, sets, legs, setPlayer, setIsGameFinish, setWinner, saveGame, reset };
})