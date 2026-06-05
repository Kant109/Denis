<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket'
import { useX01GameStore } from '@/stores/X01GameStore.js';
import X01Player from '@/components/X01/X01Player.vue';

const gameStore = useX01GameStore();

const players = computed(() => gameStore.players);
const isLastPlayerActive = ref(false);

const { messages, status } = useWebSocket(import.meta.env.VITE_WS_RECAP_URL)

const setIsLastPlayerActive = (isCurrentPlayerLast: boolean) => {
    isLastPlayerActive.value = isCurrentPlayerLast;
}

function updateGame(message: string) {
    const data = JSON.parse(message);
    gameStore.players = data.players as X01Player[];
    gameStore.isGameFinish = data.isGameFinish as boolean;
}

watch(
    () => messages.value,
    () => {
        updateGame(messages.value);
    }, { deep: true }
)

</script>

<template>
    <div class="players-container" v-if="messages">
        <div class="players-content" :class="{'lastPlayerActive': isLastPlayerActive}">
            <X01Player
                v-for="player in players"
                :player="player"
                :is-top-bg-active="players.indexOf(player) !== 0"
                :is-top-bg-player-active="players[players.indexOf(player) - 1 > 0 ? players.indexOf(player) - 1 : 0].isActive === true"
                @isLastPlayer="setIsLastPlayerActive"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>

.players-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: calc(100% - 287px);
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
        display: flex;
        flex-direction: column;
        max-width: 390px;
        width: 100%;

        &::after {
            content: "";
            height: .75rem;
            border-radius: 0 0 1rem 1rem;
            --tw-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, .25);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            background-color: var(--bg-color-secondary);
        }

        &.lastPlayerActive {
            &::after {
                background-color: var(--active-player);
            }
        }
    }
}

</style>