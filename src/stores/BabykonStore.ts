import { defineStore } from "pinia";
import { ref } from "vue";

export const useBabykonStore = defineStore('Babykon', () => {
    const players = ref([] as Array<BabykonPlayer>);
    const matchs = ref([] as Array<BabykonMatch>);

    const reset = () => {
        players.value = [];
        matchs.value = [];
    };

    return { players, matchs, reset };
})