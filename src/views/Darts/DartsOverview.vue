<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket'
import { getCheckouts } from '@/composables/useDartsCheckout';
import X01PlayerOverview from '@/components/X01/X01PlayerOverview.vue';
import { useX01GameStore } from '@/stores/X01GameStore';
import { useSound } from '@/composables/useSound';

const score = ref(301);
const checkouts = computed(() => getCheckouts(score.value))

const dartGameStore = useX01GameStore();

const players = computed(() => dartGameStore.players);
const isGameFinish = computed(() => dartGameStore.isGameFinish);
const isLastPlayerActive = ref(false);
const seeGame = ref(false);

const { messages } = useWebSocket(import.meta.env.VITE_WS_RECAP_URL)

const { play, stop } = useSound();

const setIsLastPlayerActive = (isCurrentPlayerLast: boolean) => {
    isLastPlayerActive.value = isCurrentPlayerLast;
}

function updateGame(message: string) {
    const data = JSON.parse(message);
    dartGameStore.players = data.players as X01Player[];
    dartGameStore.isGameFinish = data.isGameFinish as boolean;
}

function setCurrentScore(newScore: number) {
    score.value = newScore;
}

function playSoundForActivePlayer() {
    if(players.value.length > 0) {
        players.value.forEach(player => {
            if(player.volleys.length > 1 || !player.isActive) {
                stop(player.firstname.toLocaleLowerCase());
            }
            if(player.isActive && player.points === 301) {
                play(player.firstname.toLocaleLowerCase());
            }
        });
    }
}

function start() {
    if(players.value.length > 0) {
        seeGame.value = true;
        playSoundForActivePlayer();
    }
}

watch(
    () => isGameFinish.value,
    () => {
        if(isGameFinish.value) {
            play('victory');
        }
    }
)

watch(
    () => players.value,
    () => {
        if(players.value.length === 0) {
            score.value = 301
            isLastPlayerActive.value = false;
        }
        playSoundForActivePlayer();
    }, { deep: true }
)

watch(
    () => messages.value,
    () => {
        updateGame(messages.value);
    }, { deep: true }
)

onUnmounted(() => {
    stop('victory');
})

</script>

<template>
    <div class="players-container" v-if="seeGame">
        <div class="players-content" :class="{'lastPlayerActive': isLastPlayerActive}">
            <X01PlayerOverview
                v-for="player in players"
                :player="player"
                :is-top-bg-active="players.indexOf(player) !== 0"
                :is-top-bg-player-active="players[players.indexOf(player) - 1 > 0 ? players.indexOf(player) - 1 : 0].isActive === true"
                @isLastPlayer="setIsLastPlayerActive"
                @get-current-score="setCurrentScore"
            />
        </div>
        <div class="checkouts-container" v-if="checkouts">
            <div class="checkout-list">
                <template v-for="checkout in checkouts" :key="checkout">
                    <span v-for="(value, i) in checkout" :key="i">
                        {{ value }}{{ i < checkout.length - 1 ? ' - ' : '' }}
                    </span>
                    <span v-if="checkouts.indexOf(checkout) !== checkouts.length - 1">
                        /
                    </span>
                </template>
            </div>
        </div>
    </div>
    <div class="game-detected" v-else-if="players.length > 0 && !isGameFinish">
        <div class="join-btn" @click.prevent="start">Join game</div>
    </div>
    <div class="waiting-container" v-else>
        <p>Waiting for the game to start...</p>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.players-container, .waiting-container, .game-detected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-primary);
    padding-bottom: 2rem;
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }

    .players-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(440px, max-content));
        justify-content: center;
        justify-items: center;
        align-items: center;
        gap: 2rem;
        width: 100%;

        &.lastPlayerActive {
            &::after {
                background-color: var(--active-player);
            }
        }
    }

    .checkouts-container {
        position: absolute;
        display: flex;
        bottom: 2rem;
        text-align: center;

        h3 {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1.5rem;
            color: var(--text-color);
        }

        .checkout-list {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1.25rem;
            color: var(--text-color);

            span {
                font-size: 2rem;
            }
        }
    }

    .join-btn {
        @include btn-primary;
    }
}

</style>