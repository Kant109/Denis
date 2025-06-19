<script setup lang="ts">
import Header from '@/components/Header.vue';
import router from '@/router';
import { useBabykonStore } from '@/stores/BabykonStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { onMounted, ref, watch } from 'vue';

const playersStore = usePlayerStore();
const babykonStore = useBabykonStore();

const players = ref([] as Array<Player>);
const selectedPlayers = ref([] as Array<Player>);
const searchPlayer = ref('');
const time = ref(null as any);

const selectPlayer = (player: Player) => {
    searchPlayer.value = '';
    players.value.splice(players.value.indexOf(player), 1);
    selectedPlayers.value.push(player);
}

const removePlayer = (player: Player) => {
    selectedPlayers.value.splice(selectedPlayers.value.indexOf(player), 1);
    players.value.push(player);
}

const startTournament = () => {
    selectedPlayers.value.forEach(player => {
        babykonStore.players.push({
            ...player,
            nbWins: 0,
            score: 0
        });
    });
    router.push({ name: "babykon-tournament" });
}

const previousRoute = () => {
    router.push({ name: "babykon-mode" });
}

onMounted(() => {
    players.value = playersStore.players.slice();

    selectedPlayers.value = babykonStore.players.slice();

    players.value.forEach(player => {
        if(selectedPlayers.value.find(selectedPlayer => selectedPlayer.id === player.id)) {
            players.value.splice(players.value.indexOf(player), 1);
        }
    });

    babykonStore.players = [];
})

watch(
    () => searchPlayer.value,
    () => {
        clearTimeout(time.value);
        time.value = setTimeout(() => {
            if(searchPlayer.value === "") {
                players.value = playersStore.players.slice();
                selectedPlayers.value.forEach(selectedPlayer => {
                    players.value.splice(players.value.indexOf(selectedPlayer), 1);
                });
            } else {
                playersStore.players.forEach(player => {
                    if(!(player.pseudo.toLowerCase().includes(searchPlayer.value.toLowerCase()))) {
                        players.value = players.value.filter(p => p.id !== player.id);
                    }
                });
            }
        }, 500);
    }
)
</script>

<template>
    <div class="babykon-tournament-container">
        <div class="header">
            <Header
                title="Tournoi"
                @previous-route="previousRoute"
            />
        </div>
        <div class="babykon-tournament-select-player">
            <h2 class="title">Choix des joueurs</h2>

            <div class="search-zone">
                <div class="search-player">
                    <input type="text" placeholder="Rechercher un joueur" v-model="searchPlayer"/>
                </div>
                <div class="players-container">
                    <div class="player" v-for="player in players" :key="player.id">
                        <div class="player-content" @click.prevent="selectPlayer(player)">
                            <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstName + player.pseudo + player.name" alt="Avatar" />
                            <div class="player-name">{{ player.pseudo.length > 5 ? player.pseudo.substring(0,5) + ".." : player.pseudo}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 v-if="selectedPlayers.length > 0" class="title">Joueurs sélectionnés</h2>
            <div v-if="selectedPlayers.length > 0" class="players-selected">
                <div class="player" v-for="player in selectedPlayers" :key="player.id">
                    <div class="player-content" @click.prevent="removePlayer(player)">
                        <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstName + player.pseudo + player.name" alt="Avatar" />
                        <div class="player-name">{{ player.pseudo.length > 5 ? player.pseudo.substring(0,5) + ".." : player.pseudo}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="babykon-tournament-start">
            <button class="btn" :disabled="selectedPlayers.length < 3" @click.prevent="startTournament()">Commencer le tournoi</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.babykon-tournament-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: var(--bg-color-primary);
    padding-bottom: 2rem;

    .babykon-tournament-select-player {
        display: flex;;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 1rem;

        .search-zone {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--bg-color-secondary);
            border-radius: .5rem;
            width: 90%;
            padding: 1rem;
            box-shadow: rgb(0, 0, 0, .25) 0px 5px 5px 0px inset;
            gap: 1rem;

            .search-player {
                display: flex;
                justify-content: center;
                width: 100%;

                input {
                    width: 80%;
                    height: 35px;
                    border-radius: .5rem;
                }
            }
            
            .players-container, .players-selected {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: auto;
                grid-column-gap: 1rem;
                grid-row-gap: 1rem;
                width: 100%;
                
                .player {
                    .player-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: .5rem;
                        padding: .5rem 0;
                        
                        .player-img {
                            height: 3rem;
                            width: 3rem;
                            border-radius: 50%;
                            background-color: white;
                            cursor: pointer;
                        }
                    }
            
            
                    .player-name {
                        font-family: "Tilt Warp", sans-serif;
                        font-size: 1rem;
                        color: var(--text-color);
                    }
                }
            }
        }

        .players-selected {
            display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: auto;
                grid-column-gap: 1rem;
                grid-row-gap: 1rem;
                width: 100%;
                background-color: var(--bg-color-secondary);
                border-radius: .5rem;
                width: 90%;
                padding: 1rem;
                box-shadow: rgb(0, 0, 0, .25) 0px 5px 5px 0px inset;
                
                .player {
                    .player-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: .5rem;
                        padding: .5rem 0;
                        
                        .player-img {
                            height: 3rem;
                            width: 3rem;
                            border-radius: 50%;
                            background-color: white;
                            cursor: pointer;
                        }
                    }
            
            
                    .player-name {
                        font-family: "Tilt Warp", sans-serif;
                        font-size: 1rem;
                        color: var(--text-color);
                    }
                }
        }
    }

    .babykon-tournament-start {
        display: flex;
        justify-content: center;

        .btn {
            @include btn-primary;

            & {
                width: 90%;
                margin-top: 1rem;;
            }
        }
    }

}

</style>