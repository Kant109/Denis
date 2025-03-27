import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayerStore = defineStore('Player', () => {
    const players = ref([] as Array<Player>);

    return { players };
})