<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket'
import { useDartsCheckout } from '@/composables/useDartsCheckout';
import X01PlayerOverview from '@/components/X01/X01PlayerOverview.vue';
import { useX01GameStore } from '@/stores/X01GameStore';

const { getCheckouts } = useDartsCheckout()
const score = ref(301);
const checkouts = computed(() => getCheckouts(score.value))

const dartGameStore = useX01GameStore();

const players = computed(() => dartGameStore.players);
const isGameFinish = computed(() => dartGameStore.isGameFinish);
const isLastPlayerActive = ref(false);

const { messages, status } = useWebSocket(import.meta.env.VITE_WS_RECAP_URL)

const setIsLastPlayerActive = (isCurrentPlayerLast: boolean) => {
    isLastPlayerActive.value = isCurrentPlayerLast;
}

function updateGame(message: string) {
    const data = JSON.parse(message);
    dartGameStore.syncActiveGame({
        players: data.players as X01Player[],
        isGameFinish: data.isGameFinish as boolean,
    });
}

function setCurrentScore(newScore: number) {
    score.value = newScore;
}

watch(
    () => players.value,
    () => {
        if(players.value.length === 0) {
            score.value = 301
            isLastPlayerActive.value = false;
        }
    }, { deep: true }
)

watch(
    () => messages.value,
    () => {
        updateGame(messages.value);
    }, { deep: true }
)

</script>

<template>
    <div class="players-container" v-if="players.length > 0 && !isGameFinish">
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
            <h3>Checkouts for {{ score }}</h3>
            <div class="checkout-list">
                <template v-for="checkout in checkouts" :key="checkout.darts.join('-')">
                    <span v-for="(label, i) in checkout.labels" :key="i">
                        {{ label }}{{ i < checkout.labels.length - 1 ? ' → ' : '' }}
                    </span>
                    <br>
                </template>
            </div>
        </div>
    </div>
    <div class="waiting-container" v-else>
        <p>Waiting for the game to start...</p>
    </div>
</template>

<style lang="scss" scoped>

.players-container, .waiting-container {
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
        grid-template-columns: repeat(auto-fit, minmax(260px, max-content));
        justify-content: center;
        justify-items: center;
        align-items: center;
        gap: 2rem;
        width: 100%;
        padding: 0 1rem;

        &.lastPlayerActive {
            &::after {
                background-color: var(--active-player);
            }
        }
    }

    .checkouts-container {
        margin-top: 1.5rem;
        text-align: center;
    }
}

</style>