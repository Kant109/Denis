<script setup lang="ts">
import { useX01GameStore } from '@/stores/X01GameStore';
import { computed, watch } from 'vue';

const props = defineProps<{
  player: X01Player
  isTopBgActive: boolean
  isTopBgPlayerActive: boolean
}>()

const dartGameStore = useX01GameStore();
const players = computed(() => dartGameStore.players);

const emit = defineEmits(['isLastPlayer']);

watch(
    () => props.player.isActive,
    () => {
        if(props.player.isActive && players.value.indexOf(props.player) === players.value.length - 1) {
            emit('isLastPlayer', true);
        }
        if(!props.player.isActive && players.value.indexOf(props.player) === players.value.length - 1) {
            emit('isLastPlayer', false);
        }
    }
)

</script>

<template>
    <div class="full-content" :class="{'top-bg': props.isTopBgActive, 'top-bg-active': props.isTopBgPlayerActive && props.isTopBgActive}">
        <div class="player-content" :class="{'isPlayerActive': player.isActive }">
            <div class="player-name">{{ player.pseudo }}</div>
                <div class="recap">
                    <div class="current-points">
                    <div class="points" v-if="player.volleys.length > 0 && player.volleys[player.volleys.length - 1][0].includes('O')"><s>{{ player.volleys[player.volleys.length - 1][0].substring(1) }}</s></div>
                    <div class="points" v-else>{{ player.volleys.length > 0 ? player.volleys[player.volleys.length - 1][0] : "" }}</div>
                    <div class="points" v-if="player.volleys.length > 0 && player.volleys[player.volleys.length - 1][1].includes('O')"><s>{{ player.volleys[player.volleys.length - 1][1].substring(1) }}</s></div>
                    <div class="points" v-else>{{ player.volleys.length > 0 ? player.volleys[player.volleys.length - 1][1] : "" }}</div>
                    <div class="points" v-if="player.volleys.length > 0 && player.volleys[player.volleys.length - 1][2].includes('O')"><s>{{ player.volleys[player.volleys.length - 1][2].substring(1) }}</s></div>
                    <div class="points" v-else>{{ player.volleys.length > 0 ? player.volleys[player.volleys.length - 1][2] : "" }}</div>
                </div>
            </div>
            <div class="points-taken">{{ player.points }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.top-bg {
    background-color: var(--bg-color-secondary);
}

.top-bg-active {
    background-color: var(--active-player);
}

.player-content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    height: 60px;
    background-color: var(--bg-color-secondary);
    border-radius: 1rem 1rem 0 0;
    padding: 0 1rem;
    --tw-shadow: inset 0 5px 0 0 rgba(0, 0, 0, .25);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    &.isPlayerActive {
        background-color: var(--active-player);

        .player-name, .points-taken {
            color: #121212;
        }
    }

    .player-name, .points-taken {
        display: flex;
        align-items: center;
        font-family: "Tilt Warp", sans-serif;
        font-size: 1rem;
        color: var(--text-color);

        &:is(.player-name) {
            min-width: 55px;
            grid-area: 1 / 1 / 2 / 2;
        }

        &:is(.points-taken) {
            justify-content: flex-end;
            grid-area: 1 / 5 / 2 / 6;
        }
    }

    .recap {
        display: flex;
        justify-content: center;
        flex-direction: column;
        grid-area: 1 / 2 / 2 / 5;
        gap: .5rem;
        padding-top: 5px;

        .current-points {
            display: flex;
            justify-content: center;
            gap: 2rem;

            .points {
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: "Tilt Warp", sans-serif;
                font-size: 1rem;
                padding-bottom: 5px;
                border-radius: 8px;
                width: 2.5rem;
                aspect-ratio: 1/1;
                background-color: white;
                border: 1px solid rgba(0, 0, 0, .25);
                --tw-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, .25);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

                & s {
                    text-decoration-thickness: 2px;
                }
            }
        }
    }
}

@media screen and (max-width: 389px) {
    .player-content {
        .recap {
            .doors {
                gap: .3rem;
                .door {
                    width: 1.3rem;
                    height: 1.3rem;
                }
            }
        }
    }
}
</style>