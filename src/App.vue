<template>
    <main>
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
import { RouterView } from 'vue-router';

const managementAppStore = useManagementAppStore();
const playerStore = usePlayerStore();

const isAppLoaded = computed(() => managementAppStore.isAppLoaded);
const isAppOnError = computed(() => managementAppStore.isAppOnError);

onMounted(() => {
    playerStore.fetchPlayers();
    setTimeout(() => {
        managementAppStore.isAppLoaded = true;
    }, 2500);
})

</script>

<style lang="scss">

body {
    background-color: var(--bg-color-primary);
}
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    position: relative;
    margin-left: 5vw;
    margin-right: 5vw;

    .error-message {
        display: flex;
        height: 100%;
        align-items: center;
    }
}
.text-center {
    text-align: center;
}
.w-100 {
    width: 100%;
}
.d-flex {
    display: flex;
}
.justify-content-center {
    justify-content: center;
}
.align-items-center {
    align-items: center
}

@keyframes scale-animation {
    0% {
        scale: 1;
    }

    50% {
        scale: 1.02;
    }

    100% {
        scale: 1;
    }
}
</style>
