<script setup lang="ts">
import { averageVolleys, nbThrowDarts } from '@/common/DartsUtils';
import { useX01GameStore } from '@/stores/X01GameStore';
import { computed, watch } from 'vue';

const props = defineProps<{
  player: X01Player
  isTopBgActive: boolean
  isTopBgPlayerActive: boolean
}>()

const dartGameStore = useX01GameStore();
const players = computed(() => dartGameStore.players);

const nbThrowDartsPlayer = computed(() => nbThrowDarts(props.player))
const averageVolleysPlayer = computed(() => averageVolleys(props.player))

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
    <div class="full-content">
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
            <div class="x01-details">
                <div class="darts-details">
                    <div class="average-volleys">{{ averageVolleysPlayer }} avg.</div>
                    <div class="nb-throw-darts">
                        <img src="/public/icons/darts.svg" alt="Darts">
                        {{ nbThrowDartsPlayer }}
                    </div>
                </div>
                <div class="points">{{ player.points }}</div>
                <div class="set-and-legs">
                    <div class="sets">{{ player.sets }}</div>
                    <div class="legs">{{ player.legs }}</div>
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

.full-content {
    min-width: 470px;

    .player-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: .5rem;
        background-color: var(--bg-color-secondary);
        border-radius: 1rem;
        padding-top: 1rem;
        --tw-shadow: inset 0 5px 0 0 rgba(0, 0, 0, .25);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        width: 100%;
        border: 1px solid rgba(0, 0, 0, .25);

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
            font-size: 1.5rem;
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
            gap: .5rem;

            .current-points {
                display: flex;
                justify-content: center;
                gap: 2rem;

                .points {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 2rem;
                    padding-bottom: 5px;
                    border-radius: 8px;
                    width: 4rem;
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

        .x01-details {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            border-top: 1px solid rgba(0, 0, 0, .25);
            width: 100%;

            .darts-details {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                border-right: 1px solid rgba(0, 0, 0, .25);

                .average-volleys {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 1.5rem;
                    color: var(--text-color);
                    height: 50%;
                    width: 100%;
                    border-bottom: 1px solid rgba(0, 0, 0, .25);
                }

                .nb-throw-darts {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 1.5rem;
                    color: var(--text-color);
                    gap: .25rem;
                    height: 50%;
                    width: 100%;

                    img {
                        width: 1rem;
                        height: 1rem;
                    }
                }
            }

            .points {
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: "Tilt Warp", sans-serif;
                font-size: 5rem;
                color: var(--text-color);
                padding: 1rem;
                min-width: 150px;
            }

            .set-and-legs {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: .5rem;
                height: 100%;
                border-left: 1px solid rgba(0, 0, 0, .25);

                .sets, .legs {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 1.5rem;
                    color: var(--text-color);
                    height: 50%;
                    width: 100%;

                    &:is(.sets) {
                        border-bottom: 1px solid rgba(0, 0, 0, .25);
                    }
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