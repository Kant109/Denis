<script setup lang="ts">
import router from '@/router';
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import { computed } from 'vue';


const props = defineProps<{
  img: string
  title: string
}>()

const managementAppStore = useManagementAppStore();

const isDarkMode = computed(() => managementAppStore.isDarkMode);

</script>

<template>
    <div class="game-container" :class="{'darkMode': isDarkMode}">
        <div class="game-content">
            <img :src="'/icons/' + props.img + '.png'" alt="Image Game">
            <div class="game-text">
                <div class="game-name">{{ props.title }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.game-container {
    width: 100%;
    height: 8rem;
    position: relative;
    background-color: var(--bg-color-secondary);
    border-radius: 8px;
    cursor: pointer;

    .game-content {
        display: flex;
        align-items: center;
        height: 100%;
        
        img {
            width: 7rem;
            height: 7rem;
        }
        
        .game-text {
            padding: 1rem;
            height: 100%;

            .game-name {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.5rem;
                color: var(--text-color);
            }
        }
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        width: 1.5rem;
        height: 1.5rem;
        background-image: url("@/assets/images/black-right-arrow.svg");
    }

    &.darkMode {
        &::after {
            background-image: url("@/assets/images/white-right-arrow.svg");
        }
    }
}

</style>