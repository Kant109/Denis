import { defineStore } from "pinia";
import { ref } from "vue";
import { useManagementAppStore } from "./ManagementAppStore";

export const usePlayerStore = defineStore('Player', () => {
    const players = ref([] as Array<Player>);

    function fetchPlayers() {
        const managementAppStore = useManagementAppStore();

        const url = import.meta.env.VITE_BE_URL + "/players";

        const maPromesse = new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });

        maPromesse.then((data: any) => {
            players.value = data;
            managementAppStore.isAppLoaded = true;
        }).catch((error: any) => {
            console.log(error);
            managementAppStore.isAppOnError = true;
        });
    }

    return { players, fetchPlayers };
})