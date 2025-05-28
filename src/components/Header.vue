<script setup lang="ts">
import { computed } from 'vue';
import { useManagementAppStore } from '@/stores/ManagementAppStore';

const managementAppStore = useManagementAppStore();

const isDarkMode = computed(() => managementAppStore.isDarkMode);
const blur = computed(() => managementAppStore.blur);

const props = defineProps<{
  title: string
}>()

const emit = defineEmits(['previousRoute']);

const back = () => {
    emit('previousRoute');
}
</script>

<template>
    <div class="header" :class="{'blur': blur}">
        <img v-if="!isDarkMode" src="@/assets/images/chevron.svg" alt="Retour" @click.prevent="back">
        <img v-else src="@/assets/images/chevron-white.svg" alt="Retour" @click.prevent="back">
        <div class="title">{{ props.title }}</div>
    </div>
</template>

<style lang="scss" scoped>

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem .5rem;
    // background-color: var(--bg-color-primary);
    animation: appear .2s;

    &.blur {
        filter: blur(10px);
    }

    img {
        position: absolute;
        left: 0;
        transform: rotate(180deg);
        width: 1rem;
        height: 1rem;
        margin-left: .5rem;
    }

    .title {
        display: flex;
        justify-content: center;
        font-family: "Michroma", sans-serif;
        font-size: 2rem;
        color: var(--text-color);
    }
}

</style>