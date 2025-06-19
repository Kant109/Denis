<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const back = () => { 
    router.push({ name: "petanque-mode" });
}

</script>

<template>
    <div class="petanque-game-container">
        <Header title="PETANQUE" :sponsored-by-ricard="true" @previous-route="back" />

        <div class="petanque-game-chose-mode">
            
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

</style>