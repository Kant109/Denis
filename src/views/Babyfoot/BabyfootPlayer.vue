<script setup lang="ts">
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import PlayerSelection from '@/components/PlayerSelection.vue';
import { computed } from 'vue';
import { useManagementAppStore } from '@/stores/ManagementAppStore';

const router = useRouter();

const managementAppStore = useManagementAppStore();

const blur = computed(() => managementAppStore.openPlayers);

const back = () => {
    router.push({ name: "home" });
}

</script>

<template>
    <div class="babyfoot-players-container" :class="{'blur': blur}">
        <Header title="BABYFOOT" @previous-route="back" />
    </div>
    <PlayerSelection
        sport="babyfoot"
    />
</template>

<style lang="scss" scoped>

.babyfoot-players-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: scroll;
    padding-bottom: 2rem;

    &.blur {
        filter: blur(10px);
    }
}
// #07608d //bleu
// #bd2418 //rouge
</style>