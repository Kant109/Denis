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

const managementAppStore = useManagementAppStore();

const isAppLoaded = computed(() => managementAppStore.isAppLoaded);
const isDarkMode = computed(() => managementAppStore.isDarkMode);

onBeforeMount(() => {
    managementAppStore.isDarkMode = localStorage.getItem('darkmode-apsidart') === 'active';
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
