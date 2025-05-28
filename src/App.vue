<template>
    <main :class="{'darkmode': isDarkMode}">
        <WaitingPage v-if="!isAppLoaded" />
        <RouterView v-else />
    </main>
  
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted } from 'vue';
import { useManagementAppStore } from './stores/ManagementAppStore';
import WaitingPage from './views/WaitingPage.vue';
import { RouterView } from 'vue-router';
import { usePlayerStore } from './stores/PlayerStore';

const managementAppStore = useManagementAppStore();
const playerStore = usePlayerStore();

const isAppLoaded = computed(() => managementAppStore.isAppLoaded);
const isDarkMode = computed(() => managementAppStore.isDarkMode);
const players = computed(() => playerStore.players);

onBeforeMount(async () => {
    managementAppStore.isDarkMode = localStorage.getItem('darkmode-apsidart') === 'active';
    const url = import.meta.env.VITE_BE_URL + "/players";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const playerFromApi = await response.json();

        playerFromApi.forEach((player: Player) => {
            players.value.push(player);
        });
    } catch (error: any) {
        console.error(error.message);
    }
})

onMounted(async () => {
    // GET profil
    setTimeout(() => {
        managementAppStore.isAppLoaded = true;
    }, 2500)
})

</script>

<style lang="scss">

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    position: relative;
    background-color: var(--bg-color-primary);

    &.darkmode {
        --bg-color-primary: #121212;
        --bg-color-secondary: #3f3f3f;
        --button-primary: #ffe8b9;
        --text-color: white;
        --cricket-door-disable: rgba(255, 255, 255, 0.1);
    }
}
</style>
