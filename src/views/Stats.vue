<script setup lang="ts">
import Header from '@/components/Header.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useX01StatsApi } from '@/composables/useX01StatsApi';
import type { X01PlayerStats } from '@/interfaces/X01MatchStatsInterface';
import { usePlayerStore } from '@/stores/PlayerStore';

const goBack = () => {
    window.history.back();
}

const { getPlayerStats } = useX01StatsApi();
const playerStore = usePlayerStore();
const isLoading = ref(false);
const error = ref('');
const stats = ref<X01PlayerStats | null>(null);
const selectedPlayerId = ref<number | null>(null);

const selectedPlayers = computed(() => {
    const raw = localStorage.getItem('orderedDartsPlayer');
    if (!raw) return [] as Array<Player>;

    try {
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [] as Array<Player>;
        }

        return parsed.filter((player) => typeof player?.id === 'number') as Array<Player>;
    } catch {
        return [] as Array<Player>;
    }
});

const availablePlayers = computed(() => {
    if (selectedPlayers.value.length > 0) {
        return selectedPlayers.value;
    }

    return playerStore.players;
});

const selectedPlayer = computed(() => availablePlayers.value.find((player) => player.id === selectedPlayerId.value) ?? null);

const loadPlayerStats = async (playerId: number) => {
    isLoading.value = true;
    error.value = '';

    try {
        stats.value = await getPlayerStats(String(playerId));
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Erreur inconnue lors du chargement des stats';
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    if (playerStore.players.length === 0) {
        playerStore.fetchPlayers();
    }

    selectedPlayerId.value = availablePlayers.value[0]?.id ?? null;
});

watch(availablePlayers, (players) => {
    if (players.length === 0) {
        selectedPlayerId.value = null;
        return;
    }

    const selectedStillExists = players.some((player) => player.id === selectedPlayerId.value);
    if (!selectedStillExists) {
        selectedPlayerId.value = players[0].id;
    }
});

watch(selectedPlayerId, async (newPlayerId) => {
    if (newPlayerId === null) {
        stats.value = null;
        error.value = '';
        return;
    }

    await loadPlayerStats(newPlayerId);
});

</script>

<template>
    <div class="stats-container">
        <Header title="Stats" @previous-route="goBack" />
        <div class="stats-content">
            <div class="stats-section">
                <h2>Joueur</h2>
                <select class="player-select" v-model="selectedPlayerId" :disabled="availablePlayers.length === 0">
                    <option :value="null" disabled>Sélectionner un joueur</option>
                    <option v-for="player in availablePlayers" :key="player.id" :value="player.id">
                        {{ player.pseudo }}
                    </option>
                </select>
            </div>

            <div class="stats-section">
                <h2>Statistiques globales X01</h2>
                <div class="stats-state" v-if="isLoading">Chargement des statistiques…</div>
                <div class="stats-state" v-else-if="error">{{ error }}</div>
                <div class="stats-state" v-else-if="availablePlayers.length === 0">
                    Aucun joueur sélectionné dans l'application.
                </div>
                <div class="stats-state" v-else-if="!selectedPlayer">
                    Sélectionnez un joueur pour afficher ses statistiques.
                </div>
                <div class="stats-state" v-else-if="!stats">
                    Aucun match X01 trouvé pour le joueur sélectionné.
                </div>
                <div class="global-stats" v-else>
                    <div class="global-stats-header">
                        <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + selectedPlayer?.firstname + selectedPlayer?.pseudo + selectedPlayer?.name" alt="Avatar" />
                        <div class="player-info">
                            <div class="player-info-pseudo">{{ stats.displayName }}</div>
                            <div class="player-info-full-name">{{ stats.firstname }} {{ stats.name?.toUpperCase() }}</div>
                        </div>
                    </div>

                    <div class="match-summary">
                        <div class="match-summary-item highlight">
                            <span class="label">Nombre de parties</span>
                            <span class="value">{{ stats.matchesPlayed }}</span>
                        </div>
                        <div class="match-summary-item highlight">
                            <span class="label">Moyenne / volée</span>
                            <span class="value">{{ Number(stats.averagePerVolley).toFixed(2) }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Victoires</span>
                            <span class="value">{{ stats.wins }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Défaites</span>
                            <span class="value">{{ stats.losses }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Winrate</span>
                            <span class="value">{{ Number(stats.winRate).toFixed(2) }}%</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Sets gagnés</span>
                            <span class="value">{{ stats.setsWon }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Legs gagnés</span>
                            <span class="value">{{ stats.legsWon }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Fléchettes lancées</span>
                            <span class="value">{{ stats.dartsThrown }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Volées jouées</span>
                            <span class="value">{{ stats.volleysPlayed }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Points marqués</span>
                            <span class="value">{{ stats.totalPoints }}</span>
                        </div>
                        <div class="match-summary-item">
                            <span class="label">Meilleure volée</span>
                            <span class="value">{{ stats.bestVolley }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.stats-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .stats-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        padding: .5rem;
        color: var(--text-color);
        overflow: auto;

        .stats-section {
            display: flex;
            flex-direction: column;
            gap: .5rem;

            h2 {
                font-family: "Tilt Warp", sans-serif;
                font-size: .95rem;
                margin: 0;
            }
        }

        .stats-list {
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }

        .player-select {
            background-color: var(--bg-color-secondary);
            color: var(--text-color);
            border: 1px solid rgba(0, 0, 0, .25);
            border-radius: .5rem;
            padding: .5rem;
            font-size: .85rem;
        }

        .global-stats {
            display: flex;
            flex-direction: column;
            gap: .75rem;
            width: 100%;

            .global-stats-header {
                display: flex;
                align-items: center;
                gap: .75rem;
                background-color: var(--bg-color-secondary);
                border: 1px solid rgba(0, 0, 0, .25);
                border-radius: .5rem;
                padding: .6rem;

                .player-img {
                    display: flex;
                    height: 4rem;
                    width: 4rem;
                    border-radius: 50%;
                    background-color: white;
                    border: 1px solid rgba(0, 0, 0, .25);
                }

                .player-info {
                    display: flex;
                    flex-direction: column;
                    gap: .2rem;

                    &-pseudo {
                        font-family: "Tilt Warp", sans-serif;
                        font-size: 1rem;
                        color: var(--text-color);
                    }

                    &-full-name {
                        font-size: .75rem;
                        color: var(--text-color);
                        opacity: .85;
                    }
                }
            }

            .match-summary {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: .5rem;
                width: 100%;

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

                    &.highlight {
                        border-color: var(--active-player);

                        .value {
                            font-size: 1.05rem;
                        }
                    }
                }
            }
        }

        .stats-card {
            display: flex;
            flex-direction: column;
            gap: .2rem;
            background-color: var(--bg-color-secondary);
            border-radius: .5rem;
            border: 1px solid rgba(0, 0, 0, .25);
            padding: .6rem;
            font-size: .8rem;
        }

        .stats-state {
            font-size: .85rem;
            opacity: .9;
        }
    }
}
</style>