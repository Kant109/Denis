<script setup lang="ts">
import Header from '@/components/Header.vue';

const goBack = () => {
    window.history.back();
}

</script>

<template>
    <div class="stats-container">
        <Header title="Stats" @previous-route="goBack" />
    </div>
</template>