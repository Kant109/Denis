<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useX01StatsApi, type X01PersistedMatchResponse } from '@/composables/useX01StatsApi';
import { computed, onMounted, ref } from 'vue';

const goBack = () => {
    window.history.back();
}

const { getAllMatchStats } = useX01StatsApi();
const allMatchStats = ref<Array<X01PersistedMatchResponse>>([]);
const isLoading = ref(false);
const error = ref('');
const selectedMatchId = ref('');
const isDetailOpen = ref(false);

const PAGE_SIZE = 6;
const currentPage = ref(1);

const totalPages = computed(() => Math.max(1, Math.ceil(allMatchStats.value.length / PAGE_SIZE)));

const paginatedMatches = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return allMatchStats.value.slice(start, start + PAGE_SIZE);
});

const selectedMatch = computed(() => {
    return allMatchStats.value.find((match) => match.matchId === selectedMatchId.value) ?? null;
});

const openMatchDetail = (matchId: string) => {
    selectedMatchId.value = matchId;
    isDetailOpen.value = true;
};

const closeMatchDetail = () => {
    isDetailOpen.value = false;
};

const goToPage = (page: number) => {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value);
};

onMounted(async () => {
    isLoading.value = true;
    error.value = '';

    try {
        const allMatchStatsData = await getAllMatchStats();
        allMatchStats.value = allMatchStatsData;
    } catch (e) {
        console.error('Error fetching all match stats:', e);
        error.value = e instanceof Error ? e.message : 'Erreur inconnue lors du chargement des parties';
    } finally {
        isLoading.value = false;
    }
});

</script>

<template>
    <div class="game-details-container">
        <Header
            title="Parties"
            @previous-route="goBack"
        />
        <div class="game-details-content">
            <div class="state" v-if="isLoading">Chargement des parties...</div>
            <div class="state" v-else-if="error">{{ error }}</div>
            <div class="state" v-else-if="allMatchStats.length === 0">Aucune partie trouvée.</div>

            <template v-else>
                <div class="section">
                    <h2>Sélection d'une partie</h2>
                    <div class="matches-list">
                        <div
                            class="match-card"
                            :class="{ selected: selectedMatchId === match.matchId }"
                            v-for="match in paginatedMatches"
                            :key="match.matchId"
                            @click="openMatchDetail(match.matchId)"
                        >
                            <span class="match-title">Match {{ match.matchId }}</span>
                            <span>X{{ match.stats.mode }} · {{ match.stats.players.length }} joueur(s)</span>
                            <span>{{ match.stats.setsTarget }} set(s) / {{ match.stats.legsTarget }} leg(s)</span>
                        </div>
                    </div>

                    <div class="pagination" v-if="totalPages > 1">
                        <button
                            class="pagination-btn"
                            :disabled="currentPage === 1"
                            @click="goToPage(currentPage - 1)"
                        >
                            ‹
                        </button>
                        <span class="pagination-info">Page {{ currentPage }} / {{ totalPages }}</span>
                        <button
                            class="pagination-btn"
                            :disabled="currentPage === totalPages"
                            @click="goToPage(currentPage + 1)"
                        >
                            ›
                        </button>
                    </div>
                </div>

                <dialog class="dialog" :open="isDetailOpen" v-if="isDetailOpen && selectedMatch">
                    <div class="dialog-content">
                        <div class="dialog-header dialog-header--sticky">
                            <h3 class="dialog-title">Match {{ selectedMatch.matchId }}</h3>
                            <span class="dialog-close" @click.prevent="closeMatchDetail">x</span>
                        </div>
                        <div class="dialog-body">
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <span class="label">Mode</span>
                                    <span class="value">X{{ selectedMatch.stats.mode }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Sets / Legs</span>
                                    <span class="value">{{ selectedMatch.stats.setsTarget }} / {{ selectedMatch.stats.legsTarget }}</span>
                                </div>
                                <div class="summary-item">
                                    <span class="label">Legs joués</span>
                                    <span class="value">{{ selectedMatch.stats.legsPlayed }}</span>
                                </div>
                            </div>

                            <div class="players-section">
                                <h3>Stats des joueurs</h3>
                                <div class="players-list">
                                    <div class="player-card" :class="{ winner: player.isWinner }" v-for="player in selectedMatch.stats.players" :key="player.playerId">
                                        <div class="player-header">
                                            <span class="player-name">{{ player.displayName }}</span>
                                            <span class="winner-badge" v-if="player.isWinner">Winner</span>
                                        </div>
                                        <div class="player-stats">
                                            <div class="stat">
                                                <span class="stat-label">Sets gagnés</span>
                                                <span class="stat-value">{{ player.setsWon }}</span>
                                            </div>
                                            <div class="stat">
                                                <span class="stat-label">Legs gagnés</span>
                                                <span class="stat-value">{{ player.legsWon }}</span>
                                            </div>
                                            <div class="stat">
                                                <span class="stat-label">Moyenne / volée</span>
                                                <span class="stat-value">{{ Number(player.averagePerVolley).toFixed(2) }}</span>
                                            </div>
                                            <div class="stat">
                                                <span class="stat-label">Best volley</span>
                                                <span class="stat-value">{{ player.bestVolley }}</span>
                                            </div>
                                            <div class="stat">
                                                <span class="stat-label">Fléchettes</span>
                                                <span class="stat-value">{{ player.dartsThrown }}</span>
                                            </div>
                                            <div class="stat">
                                                <span class="stat-label">Volées</span>
                                                <span class="stat-value">{{ player.volleysPlayed }}</span>
                                            </div>
                                            <div class="stat">
                                                <span class="stat-label">Total points</span>
                                                <span class="stat-value">{{ player.totalPoints }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </dialog>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/dialog.scss";

.game-details-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-primary);

    .game-details-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        height: 100%;
        padding: .5rem;
        color: var(--text-color);
        overflow: auto;

        .state {
            font-size: .9rem;
            opacity: .9;
        }

        .section {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            width: 100%;

            h2 {
                margin: 0;
                font-family: "Tilt Warp", sans-serif;
                font-size: .95rem;
            }
        }

        .matches-list {
            display: flex;
            flex-direction: column;
            gap: .45rem;
        }

        .pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: .75rem;
            margin-top: .5rem;

            .pagination-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2rem;
                height: 2rem;
                font-size: 1.1rem;
                line-height: 1;
                border: 1px solid rgba(0, 0, 0, .25);
                border-radius: .5rem;
                background-color: var(--bg-color-secondary);
                color: var(--text-color);
                cursor: pointer;

                &:disabled {
                    opacity: .4;
                    cursor: not-allowed;
                }
            }

            .pagination-info {
                font-size: .8rem;
                opacity: .85;
            }
        }

        .match-card {
            display: flex;
            flex-direction: column;
            gap: .2rem;
            background-color: var(--bg-color-secondary);
            border: 1px solid rgba(0, 0, 0, .25);
            border-radius: .5rem;
            padding: .6rem;
            font-size: .8rem;
            width: 100%;
            min-width: 0;
            cursor: pointer;
            word-break: break-word;

            &.selected {
                border-color: var(--active-player);
            }

            .match-title {
                font-family: "Tilt Warp", sans-serif;
                font-size: .86rem;
            }
        }

        .dialog-body {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            padding: 1rem;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: .6rem;

            .summary-item {
                display: flex;
                flex-direction: column;
                gap: .25rem;
                background-color: var(--bg-color-secondary);
                border: 1px solid rgba(0, 0, 0, .15);
                border-radius: .6rem;
                padding: .7rem .8rem;
                min-width: 0;

                .label {
                    font-size: .72rem;
                    text-transform: uppercase;
                    letter-spacing: .03em;
                    opacity: .65;
                }

                .value {
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 1.05rem;
                    word-break: break-word;
                }
            }
        }

        .players-section {
            display: flex;
            flex-direction: column;
            gap: .6rem;

            h3 {
                margin: 0;
                font-family: "Tilt Warp", sans-serif;
                font-size: 1rem;
            }
        }

        .players-list {
            display: flex;
            flex-direction: column;
            gap: .7rem;
        }

        .player-card {
            display: flex;
            flex-direction: column;
            gap: .65rem;
            background-color: var(--bg-color-secondary);
            border: 1px solid rgba(0, 0, 0, .15);
            border-radius: .6rem;
            padding: .85rem;
            width: 100%;
            min-width: 0;
            word-break: break-word;

            &.winner {
                border-color: var(--active-player);
                border-width: 2px;
            }

            .player-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: .5rem;
                flex-wrap: wrap;
                padding-bottom: .55rem;
                border-bottom: 1px solid rgba(0, 0, 0, .12);
            }

            .player-name {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.05rem;
            }

            .winner-badge {
                font-size: .7rem;
                padding: .15rem .45rem;
                border-radius: .35rem;
                border: 1px solid rgba(0, 0, 0, .2);
                background-color: var(--active-player);
            }

            .player-stats {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: .4rem .9rem;

                .stat {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: .5rem;
                    min-width: 0;

                    .stat-label {
                        font-size: .78rem;
                        opacity: .7;
                    }

                    .stat-value {
                        font-family: "Tilt Warp", sans-serif;
                        font-size: .95rem;
                        white-space: nowrap;
                    }
                }
            }
        }

        @media (max-width: 520px) {
            .summary-grid {
                grid-template-columns: 1fr;
            }

            .player-card .player-stats {
                grid-template-columns: 1fr;
            }

            .match-card {
                font-size: .78rem;
            }
        }
    }
}
</style>