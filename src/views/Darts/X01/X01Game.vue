<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import X01Board from '@/components/X01/X01Board.vue';
import X01Player from '@/components/X01/X01Player.vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { useWebSocket } from '@/composables/useWebSocket'
import { useX01GameStore } from '@/stores/X01GameStore';

const { send, status } = useWebSocket(import.meta.env.VITE_WS_RECAP_URL);

const dartGameStore = useX01GameStore();

const players = computed(() => dartGameStore.players);
const isGameFinish = computed(() => dartGameStore.isGameFinish);
const isLastPlayerActive = ref(false);
const winnerNavigationTimeout = ref<number | null>(null);
const title = computed(() => dartGameStore.mode);

const router = useRouter();

const setIsLastPlayerActive = (isCurrentPlayerLast: boolean) => {
    isLastPlayerActive.value = isCurrentPlayerLast;
}

const back = () => {
    dartGameStore.reset();
    router.push({ name: "darts-mode-x01" });
}

watch(
    () => players.value,
    () => {
        send(JSON.stringify({
            players: players.value,
            isGameFinish: isGameFinish.value
        }));
    }, { deep: true }
)

watch(
    () => status.value,
    () => {
        send(JSON.stringify({
            players: players.value,
            isGameFinish: isGameFinish.value
        }));
    }
)

watch(() => isGameFinish.value, (isFinished) => {
    if(!isFinished) {
        if(winnerNavigationTimeout.value) {
            window.clearTimeout(winnerNavigationTimeout.value);
            winnerNavigationTimeout.value = null;
        }
        return;
    }

    if(winnerNavigationTimeout.value) {
        window.clearTimeout(winnerNavigationTimeout.value);
    }

    winnerNavigationTimeout.value = window.setTimeout(() => {
        router.push({ name: "x01-winner" });
    }, 600);
});

onMounted(() => {
    if(players.value.length > 0 && !dartGameStore.activeGame) {
        dartGameStore.startGameFromDraft();
    }
});

</script>

<template>
    <Header :title="title" @previous-route="back" />
    <div class="players-container">
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
    <X01Board />
</template>

<style lang="scss" scoped>

.points-recap-doors {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 390px;
    margin-bottom: 1rem;
    
    .recap-doors {
        display: flex;
        gap: .5rem;
        font-family: "Tilt Warp", sans-serif;
        font-size: 1rem;

        .recap-door {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            background-color: var(--bg-color-primary);
            width: 1.5rem;
            aspect-ratio: 1/1;
        }
    }
}

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

@media screen and (max-width: 389px) {
    .players-container {
        max-height: calc(100vh - 278px);
    }
}
</style>