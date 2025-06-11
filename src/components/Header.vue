<script setup lang="ts">
import { computed } from 'vue';
import { useManagementAppStore } from '@/stores/ManagementAppStore';

const managementAppStore = useManagementAppStore();

const blur = computed(() => managementAppStore.blur);

const { madeByMatis = false, improveBySimon = false} = defineProps<{
  title: string,
  madeByMatis?: boolean
  improveBySimon?: boolean
}>()

const emit = defineEmits(['previousRoute']);

const back = () => {
    emit('previousRoute');
}
</script>

<template>
    <div class="header" :class="{'blur': blur}">
        <img src="@/assets/images/chevron.svg" alt="Retour" @click.prevent="back">
        <div class="title">
            {{ title }}
            <div class="by-matis" v-if="madeByMatis">by Matis</div>
            <div class="improve-by-simon" v-if="madeByMatis && improveBySimon">improve by Simon </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem .5rem;
    background-color: transparent;
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
        font-family: "Honk", system-ui;
        font-size: 4rem;
        color: var(--text-color);
        position: relative;

        .by-matis, .improve-by-simon {
            position: absolute;
            bottom: -.75rem;
            right: -1.25rem;
            font-family: "Caveat", cursive;
            font-style: normal;
            font-size: 1.5rem;
            color: red;
            rotate: -10deg;
        }

        
        .improve-by-simon {
            bottom: -1rem;
            right: -6rem;
            font-size: 1rem;
            color: #c1ad42;
        }
    }

}

</style>