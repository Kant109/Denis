<template>
    <main :class="{'babykon': isBabyKonView(), 'petanque': isPetanqueView()}">
        <WaitingPage v-if="!isAppLoaded && !isAppOnError" />
        <RouterView v-if="isAppLoaded" />
        <div v-if="isAppOnError" class="error-message">
            <h1>Ah bah merde c'est KO</h1>
        </div>
    </main>
  
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useManagementAppStore } from './stores/ManagementAppStore';
import { usePlayerStore } from './stores/PlayerStore';
import WaitingPage from './views/WaitingPage.vue';
import { RouterView, useRouter } from 'vue-router';

const managementAppStore = useManagementAppStore();
const playerStore = usePlayerStore();

const router = useRouter();

const isBabyKonView = () => {
    return router.currentRoute.value.name === 'babykon-mode' || router.currentRoute.value.name === 'babykon-game' || router.currentRoute.value.name === 'babykon-tournament-selection-player' || router.currentRoute.value.name === 'babykon-tournament' || router.currentRoute.value.name === 'babykon-tournament-results';
}

const isPetanqueView = () => {
    return router.currentRoute.value.name === 'petanque-mode' || router.currentRoute.value.name === 'petanque-game';
}

const isAppLoaded = computed(() => managementAppStore.isAppLoaded);
const isAppOnError = computed(() => managementAppStore.isAppOnError);

onMounted(async () => {
    playerStore.fetchPlayers();
})

</script>

<style lang="scss">

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    position: relative;
    background-color: var(--bg-color-primary);

    &.babykon {
        background-color: #a4eeeb;
    }

    &.petanque {
        background-color: #ffc700;
    }

    .error-message {
        display: flex;
        height: 100%;
        align-items: center;
    }
}
</style>
