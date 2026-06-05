<script setup lang="ts">
import { useX01GameStore } from '@/stores/X01GameStore';
import { computed } from 'vue';

const gameStore = useX01GameStore();

const players = computed(() => gameStore.players);

</script>

<template>
    <div class="recap-container">
        
    </div>
</template>