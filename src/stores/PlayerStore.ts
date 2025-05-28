import { defineStore } from "pinia";
import { ref } from "vue";
import { useManagementAppStore } from "./ManagementAppStore";

export const usePlayerStore = defineStore('Player', () => {
    const players = ref([] as Array<Player>);

    async function fetchPlayers() {
        const managementAppStore = useManagementAppStore();

        const url = import.meta.env.VITE_BE_URL + "/players";

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            players.value = await response.json();
            managementAppStore.isAppLoaded = true
        } catch (error: any) {
            managementAppStore.isAppOnError = true;
        }
    }

    return { players, fetchPlayers };
})