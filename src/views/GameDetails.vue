<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/stores/PlayerStore';
import { useManagementAppStore } from '@/stores/ManagementAppStore';

const playerStore = usePlayerStore();
const managementAppStore = useManagementAppStore();

const selectedSport = ref("");
const games = ref([] as Array<GameDetails>);
const isAllPlayersOpen = ref(false);

const router = useRouter();

const getGameDetails = async (sport: string) => {
    const url = import.meta.env.VITE_BE_URL + "/" + sport + "/game/detail";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        games.value = await response.json();
    } catch (error: any) {
        console.error(error.message);
    }
}

const previousRoute = () => {
    router.push({ name:"home" });
}

const seeGameDetails = (game: GameDetails) => {
    managementAppStore.seeGameDetails = true;
    playerStore.players = game.dartPlayers;
    router.push({ name: "recap-game", params: {gameId: game.id} });
}

const beautifyDate = (date: string) => {
    const parts = date.split("-");
    if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return `${day}/${month}/${year}`;
    } else {
        return date;
    }
}

onBeforeMount(() => {
    selectedSport.value = localStorage.getItem('game-details-denis') !== null ? localStorage.getItem('game-details-denis') as string : 'dart';
})

watch(
    () => selectedSport.value,
    () => getGameDetails(selectedSport.value)
)

</script>

<template>
    <div class="game-details-container">
        <Header
            title="Parties"
            @previous-route="previousRoute"
        />
        <div class="select-sport">
            <label for="sport-select">Choisis un sport:</label>
            
            <select name="sport" id="sport-select" v-model="selectedSport">
                <option value="dart" :selected="selectedSport === 'dart'">Fléchettes</option>
            </select>
        </div>
        <div class="game-details-content">
            <div class="game" v-for="game in games">
                <div class="info-game">
                    <div class="id">
                        Partie du {{ beautifyDate(game.date) }}
                    </div>
                    <div class="nb-players">
                        {{ game.dartPlayers.length.toString() }}
                        <img src="@/assets/images/users.svg" alt="Nombre de joueurs">
                    </div>
                </div>
                <div v-if="game.statut === 'COMPLETED'" class="winner-info">
                    <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + game.dartPlayers[0].firstName + game.dartPlayers[0].pseudo + game.dartPlayers[0].name" alt="Avatar" />
                    {{ game.dartPlayers[0].firstName }} "{{ game.dartPlayers[0].pseudo }}" {{ game.dartPlayers[0].name }} 
                    <img class="trophy" src="@/assets/images/trophy_3d.png" alt="Trophée">
                </div>
                <div class="game-statut" v-else>
                    Partie en cours
                </div>
                <div v-if="game.statut === 'COMPLETED'" class="other-players">
                    <details class="accordion" :open="isAllPlayersOpen">
                        <summary>
                            Joueurs
                        </summary>
                        <div class="accordion-content">
                            <div class="players-name" v-for="player in game.dartPlayers">
                                <img class="players-avatar" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstName + player.pseudo + player.name" alt="Avatar">
                                {{ player.firstName }} "{{ player.pseudo }}" {{ player.name }}
                            </div>
                        </div>
                    </details>
                </div>
                <div v-if="game.statut === 'COMPLETED'" class="see-more" @click.prevent="seeGameDetails(game)">plus de statistiques</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.game-details-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: var(--bg-color-primary);

    .select-sport {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 1rem;

        label {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;
            color: var(--text-color);
            margin-bottom: .5rem;
        }

        select {
            width: 100%;
            height: 2rem;
            border: 1px solid lightgray;
            font-family: "Tilt Warp", sans-serif;
            color: var(--text-color);
            border-radius: .5rem;
            text-align: center;

            option {
                font-family: "Tilt Warp", sans-serif;
                color: var(--text-color);
            }
        }
    }

    .game-details-content {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
        padding: 1rem;

        .game {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            min-height: 3rem;
            position: relative;
            background-color: var(--bg-color-secondary);
            border-radius: 8px;
            cursor: pointer;
            font-family: "Playpen Sans", sans-serif;
            font-size: 1rem;
            padding: 1rem;
            gap: .5rem;

            .info-game {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;

                .nb-players {
                    display: flex;
                    align-items: center;
                    font-size: 1.125rem;

                    img {
                        width: 2rem;
                        aspect-ratio: 1/1;
                    }
                }
            }

            .winner-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                font-family: "Michroma", sans-serif;
                font-size: 1rem;
                color: var(--text-color);

                .player-img {
                    width: 4rem;
                    height: 4rem;
                }

                .trophy {
                    width: 2rem;
                    height: 2rem;
                }
            }

            .game-statut {
                font-size: 1.5rem;
            }

            .other-players {
                display: flex;
                align-items: center;
                width: 100%;

                details.accordion {
                    font-size: 1rem;
                    width: 100%;
                    border-radius: .5rem;
                    align-items: center;
                    transition: all 1s ease;
                    cursor: pointer;
                    padding: 0 1rem;

                    summary {
                        display: flex;
                        font-size: 1.125rem;
                        display: flex;
                        align-items: center;

                        &::after {
                            content: "";
                            width: 1.125rem;
                            aspect-ratio: 1/1;
                            margin-left: auto;
                            transition: transform 0.8s ease;
                            background-image: url("@/assets/images/chevron-down.svg");
                            background-position: center;
                            background-repeat: no-repeat;
                            background-size: contain;
                        }
                    }

                    .accordion-content {
                        display: flex;
                        flex-direction: column;
                        gap: .5rem;
                        padding-top: .5rem;

                        .players-name {
                            display: flex;
                            font-family: "Michroma", sans-serif;
                            font-size: 1rem;
                            color: var(--text-color);
                            gap: 1rem;

                            .players-avatar {
                                height: 3rem;
                                width: 3rem;
                            }
                        }
                    }
                }

                details.accordion[open] {
                    summary {
                        &::after {
                            transform: rotate(180deg);
                        }
                    }
                }
            }

            .see-more {
                text-decoration: underline;
                font-size: .75rem;
                color: grey;
            }
        }
    }
}
</style>