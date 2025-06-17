<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useBabykonStore } from '@/stores/BabykonStore';

const babykonStore = useBabykonStore();

const players = babykonStore.players;
</script>

<template>
    <div class="babykon-tournament-container">
        <div class="header">
            <Header
                title="Tournoi"
                @previous-route="$router.back()"
            />
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
</style>