import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePetanqueStore = defineStore('Petanque', () => {
    const nbTeams = ref(0);
    const nbPlayersByTeam = ref(0);
    // const teams = ref([] as Array<>)

    return { nbTeams, nbPlayersByTeam };
})