<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useX01GameStore } from "@/stores/X01GameStore";
import { buildX01MatchStats } from "@/common/X01StatsUtils";
import { clearX01LocalStorage } from "@/common/X01PersistenceUtils";
import { useX01StatsApi } from "@/composables/useX01StatsApi";

const dartGameStore = useX01GameStore();
const winnerPlayer = computed(() => dartGameStore.winnerPlayer);
const matchStats = computed(() => {
    if (dartGameStore.matchStats) return dartGameStore.matchStats;

    return buildX01MatchStats(
        dartGameStore.games,
        dartGameStore.mode,
        dartGameStore.sets,
        dartGameStore.legs,
        dartGameStore.winnerPlayer,
    );
});
const winnerStats = computed(() => {
    return matchStats.value.players.find(player => player.isWinner) ?? matchStats.value.players[0];
});

const { saveMatchStats } = useX01StatsApi();
const isSavingStats = ref(false);
const saveStatsError = ref('');
const persistedMatchId = ref('');

const router = useRouter();

onMounted(async () => {
    if (!matchStats.value || matchStats.value.players.length <= 0) {
        return;
    }

    isSavingStats.value = true;
    saveStatsError.value = '';

    try {
        const persisted = await saveMatchStats(matchStats.value);
        persistedMatchId.value = persisted.matchId;
        sessionStorage.setItem('x01-last-persisted-match-id', persisted.matchId);
    } catch (error) {
        saveStatsError.value = error instanceof Error ? error.message : 'Erreur inconnue lors de la sauvegarde';
    } finally {
        isSavingStats.value = false;
    }
});

const back = () => {
    clearX01LocalStorage();
    dartGameStore.reset();
    router.push({ name: "home"});
}

const replay = () => {
    clearX01LocalStorage();
    dartGameStore.reset();
    router.push({ name: "darts-mode-x01"});
}

</script>

<template>
    <div class="winning-container">
        <div class="winner-content">
            <img class="back" src="@/assets/images/chevron.svg" alt="Retour" @click.prevent="back">
            <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + winnerPlayer.firstname + winnerPlayer.pseudo + winnerPlayer.name" alt="Avatar"></img>
            <div class="player-info">
                <div class="player-info-pseudo">{{ winnerPlayer.pseudo }}</div>
                <div class="player-info-full-name">{{ winnerPlayer.firstname }} {{ winnerPlayer.name?.toUpperCase() }}</div>
            </div>
        </div>
        <div class="match-summary" v-if="winnerStats">
            <div class="match-summary-item">
                <span class="label">Mode</span>
                <span class="value">X{{ matchStats.mode }}</span>
            </div>
            <div class="match-summary-item">
                <span class="label">Sets/Legs</span>
                <span class="value">{{ matchStats.setsTarget }} / {{ matchStats.legsTarget }}</span>
            </div>
            <div class="match-summary-item">
                <span class="label">Legs joués</span>
                <span class="value">{{ matchStats.legsPlayed }}</span>
            </div>
            <div class="match-summary-item">
                <span class="label">Moyenne</span>
                <span class="value">{{ winnerStats.averagePerVolley.toFixed(2) }}</span>
            </div>
            <div class="match-summary-item">
                <span class="label">Fléchettes</span>
                <span class="value">{{ winnerStats.dartsThrown }}</span>
            </div>
            <div class="match-summary-item">
                <span class="label">Meilleure volée</span>
                <span class="value">{{ winnerStats.bestVolley }}</span>
            </div>
        </div>
        <div class="players-ranking" v-if="matchStats.players.length > 0">
            <div class="players-ranking-title">Classement de la partie</div>
            <div class="players-ranking-list">
                <div class="players-ranking-item" :class="{ 'is-winner': player.isWinner }" v-for="(player, index) in matchStats.players" :key="player.playerId">
                    <span class="position">{{ index + 1 }}</span>
                    <span class="name">{{ player.displayName }}</span>
                    <span class="stats">{{ player.averagePerVolley.toFixed(2) }} avg · {{ player.dartsThrown }} <img src="/public/icons/darts.svg" alt=""></span>
                </div>
            </div>
        </div>
        <div class="stats-persist-status" v-if="isSavingStats || persistedMatchId || saveStatsError">
            <span v-if="isSavingStats">Sauvegarde des stats en cours…</span>
            <span v-else-if="persistedMatchId">Stats sauvegardées (match {{ persistedMatchId }})</span>
            <span v-else>{{ saveStatsError }}</span>
        </div>
        <div class="btn-replay" @click.prevent="replay">Rejouer</div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.winning-container { 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 100%;
    background-color: var(--bg-color-primary);
    padding-bottom: 2rem;

    .animation {
        position: absolute;
        top: 0;
        left: 0;
    }

    .winner-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 2rem 0;
        position: relative;

        .back {
            position: absolute;
            left: 0;
            top: 1rem;
            transform: rotate(180deg);
            width: 1.5rem;
            height: 1.5rem;
            margin-left: .5rem;
        }

        .player-img {
            display: flex;
            height: 10rem;
            width: 10rem;
            border-radius: 50%;
            background-color: white;
            border: 1px solid rgba(0, 0, 0, .25);
        }

        .player-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            &-pseudo {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.5rem;
                color: var(--text-color);
                text-align: center;
                margin-top: 1rem;
            }

            &-full-name {
                display: flex;
                font-family: "Tilt Warp", sans-serif;
                font-size: 1rem;
                color: var(--text-color);
                text-align: center;
                margin-top: .5rem;
            }
        }
    }

    .match-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: .5rem;
        width: 100%;
        max-width: 390px;
        padding: 0 .5rem;

        &-item {
            display: flex;
            flex-direction: column;
            background-color: var(--bg-color-secondary);
            border-radius: .5rem;
            padding: .5rem;
            border: 1px solid rgba(0, 0, 0, .25);

            .label {
                font-size: .75rem;
                color: var(--text-color);
                opacity: .75;
            }

            .value {
                font-family: "Tilt Warp", sans-serif;
                font-size: .9rem;
                color: var(--text-color);
            }
        }
    }

    .players-ranking {
        width: 100%;
        max-width: 390px;
        margin-top: .75rem;
        padding: 0 .5rem;

        &-title {
            font-family: "Tilt Warp", sans-serif;
            font-size: .95rem;
            color: var(--text-color);
            margin-bottom: .35rem;
        }

        &-list {
            display: flex;
            flex-direction: column;
            gap: .35rem;
        }

        &-item {
            display: grid;
            grid-template-columns: 28px 1fr auto;
            align-items: center;
            gap: .5rem;
            background-color: var(--bg-color-secondary);
            border: 1px solid rgba(0, 0, 0, .25);
            border-radius: .5rem;
            padding: .45rem .6rem;
            color: var(--text-color);
            font-size: .75rem;

            &.is-winner {
                background-color: var(--active-player);
            }

            .position {
                font-family: "Tilt Warp", sans-serif;
                font-size: .8rem;
            }

            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .stats {
                font-size: .7rem;

                img {
                    width: 1rem;
                    height: 1rem;
                    margin-left: .25rem;
                }
            }
        }
    }

    #chart {
        width: 100%;
    }

    .btn-replay {
        @include btn-primary;
        & {
            width: 80%;
            max-width: 390px;
            margin-top: .75rem;
        }
    }

    .stats-persist-status {
        width: 100%;
        max-width: 390px;
        margin-top: .75rem;
        padding: 0 .75rem;
        color: var(--text-color);
        font-size: .75rem;
        text-align: center;
        opacity: .85;
    }
}
</style>