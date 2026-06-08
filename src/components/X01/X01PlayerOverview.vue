<script setup lang="ts">
import { useX01GameStore } from '@/stores/X01GameStore';
import { computed, watch } from 'vue';

const props = defineProps<{
  player: X01Player
  isTopBgActive: boolean
  isTopBgPlayerActive: boolean
}>()

const gameStore = useX01GameStore();
const players = computed(() => gameStore.players);

const averageVolleys = computed(() => {
    if(props.player.volleys.length === 0) return 0;
    const totalPoints = props.player.volleys.reduce((acc, volley) => {
        return acc + volley.reduce((volleyAcc, dart) => {
            const points = parseInt(dart.replace('O', '')) || 0;
            return volleyAcc + points;
        }, 0);
    }, 0);
    return (totalPoints / props.player.volleys.length).toFixed(2);
})

const nbThrowDarts = computed(() => {
    return props.player.volleys.reduce((acc, volley) => {
        return acc + volley.filter(dart => dart !== '').length;
    }, 0);
})

const emit = defineEmits(['isLastPlayer', 'getCurrentScore']);

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

watch(
    () => props.player,
    () => {
        if(props.player.isActive) {
            emit('getCurrentScore', props.player.points);
        }
    }, { deep: true }
)

</script>

<template>
    <div class="full-content" :class="{'top-bg': props.isTopBgActive, 'top-bg-active': props.isTopBgPlayerActive && props.isTopBgActive}">
        <div class="player-content" :class="{'isPlayerActive': player.isActive }">
            <div class="player-name">{{ player.firstname }} "{{ player.pseudo }}" {{ player.name }}</div>
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
            <div class="darts-details">
                <div class="average-volleys">{{ averageVolleys }} avg.</div>
                <div class="nb-throw-darts">
                    <img src="/public/icons/darts.svg" alt="Darts">
                    {{ nbThrowDarts }}
                </div>
            </div>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-secondary);
    border-radius: 1rem 1rem 0 0;
    padding: 1rem;
    --tw-shadow: inset 0 5px 0 0 rgba(0, 0, 0, .25);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

    &.isPlayerActive {
        background-color: var(--active-player);

        .player-name, .points-taken {
            color: #121212;
        }
    }

    .player-name {
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

    .points-taken {
        display: flex;
        align-items: center;
        font-family: "Tilt Warp", sans-serif;
        font-size: 4rem;
        color: var(--text-color);
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

    .darts-details {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: .5rem;

        .average-volleys {
            display: flex;
            align-items: center;
            font-family: "Tilt Warp", sans-serif;
            font-size: .875rem;
            color: var(--text-color);
        }

        .nb-throw-darts {
            display: flex;
            align-items: center;
            font-family: "Tilt Warp", sans-serif;
            font-size: .875rem;
            color: var(--text-color);
            gap: .25rem;

            img {
                width: 1rem;
                height: 1rem;
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