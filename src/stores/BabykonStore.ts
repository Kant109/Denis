import { defineStore } from "pinia";
import { ref } from "vue";

export const useBabykonStore = defineStore('Babykon', () => {
    const players = ref([] as Array<Player>);

    return { players };
})