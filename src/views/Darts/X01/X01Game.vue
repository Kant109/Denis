<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import X01Board from '@/components/X01/X01Board.vue';
import X01Player from '@/components/X01/X01Player.vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { useWebSocket } from '@/composables/useWebSocket'
import { useX01GameStore } from '@/stores/X01GameStore';
import { clearX01LocalStorage } from '@/common/X01PersistenceUtils';

const { send, status } = useWebSocket(import.meta.env.VITE_WS_RECAP_URL);

const dartGameStore = useX01GameStore();

const players = computed(() => dartGameStore.players);
const games = computed(() => dartGameStore.games);
const isGameFinish = computed(() => dartGameStore.isGameFinish);
const isLastPlayerActive = ref(false);
const title = dartGameStore.mode;

const historyEvents = computed(() => {
    return games.value.map((game: X01Game, index: number) => {
        const winner = game.players.find((player: X01Player) => player.points === 0);

        return {
            eventIndex: index + 1,
            eventType: game.eventType,
            eventLabel: game.eventType === 'end_match' ? 'Fin de match' : `Fin de leg ${index + 1}`,
            winnerName: winner ? `${winner.firstname} \"${winner.pseudo}\" ${winner.name}` : '-',
            sets: winner?.sets ?? 0,
            legs: winner?.legs ?? 0,
        }
    }).slice().reverse();
});

const router = useRouter();

const setIsLastPlayerActive = (isCurrentPlayerLast: boolean) => {
    isLastPlayerActive.value = isCurrentPlayerLast;
}

const back = () => {
    clearX01LocalStorage();
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

watch(() => isGameFinish.value, () => router.push({ name: "x01-winner" }));

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
        <div class="legs-history" v-if="historyEvents.length > 0">
            <div class="legs-history-title">Historique des événements</div>
            <div class="legs-history-list">
                <div
                    class="legs-history-item"
                    :class="{'is-match-end': event.eventType === 'end_match'}"
                    v-for="event in historyEvents"
                    :key="`${event.eventIndex}-${event.eventType}`"
                >
                    <span class="event-label">{{ event.eventLabel }}</span>
                    <span>{{ event.winnerName }}</span>
                    <span>{{ event.sets }} set / {{ event.legs }} leg</span>
                </div>
            </div>
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
    height: calc(100% - 334px);
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

    .legs-history {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
        max-width: 390px;
        margin-top: .75rem;
        padding: 0 .5rem;

        .legs-history-title {
            font-family: "Tilt Warp", sans-serif;
            font-size: .95rem;
            color: var(--text-color);
        }

        .legs-history-list {
            display: flex;
            flex-direction: column;
            gap: .35rem;
        }

        .legs-history-item {
            display: grid;
            grid-template-columns: 110px 1fr auto;
            align-items: center;
            gap: .5rem;
            font-size: .75rem;
            color: var(--text-color);
            background-color: var(--bg-color-secondary);
            border-radius: .5rem;
            padding: .45rem .6rem;
            border: 1px solid rgba(0, 0, 0, .25);

            &.is-match-end {
                background-color: var(--active-player);
            }

            .event-label {
                font-family: "Tilt Warp", sans-serif;
                font-size: .7rem;
            }
        }
    }
}

</style>