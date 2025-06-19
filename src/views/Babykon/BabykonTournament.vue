<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useBabykonStore } from '@/stores/BabykonStore';
import { computed, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LottieAnimation } from "lottie-web-vue";
import LoaderAnimation from "../../assets/animations/stats.json";

const router = useRouter();

const babykonStore = useBabykonStore();

const players = computed(() => babykonStore.players);
const matchs = computed(() => babykonStore.matchs);
const startAnimation = ref(false);
const openDialogModal = ref(false);

function genererMatchs(players: Array<BabykonPlayer>) {
    let matchId = 0;
    for (let player = 0; player < players.length; player++) {
        for (let opponent = player + 1; opponent < players.length; opponent++) {
            const newMatch = {
                matchId: matchId++,
                winnerId: null as number | null,
                player1: players[player],
                player2: players[opponent],
                scoreP1: 0,
                scoreP2: 0
            }
            matchs.value.push(newMatch);
        }
    }
}

function shuffleMatch<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const isWinner = (match: BabykonMatch, player: BabykonPlayer) => {
    match.winnerId = match.winnerId === player.id ? null : player.id;
}

const isResultsOk = async (): Promise<boolean> => {
    let isOk = true;
    matchs.value.forEach(match => {
        if (match.winnerId === null) {
            isOk = false;
        }
    });
    return isOk;
}

const getRanking = async () => {
    matchs.value.forEach(match => {
        players.value.forEach(player => {
            if(match.winnerId === player.id) {
                player.nbWins += 1;
            }
        })
        players.value[players.value.indexOf(match.player1)].score += match.scoreP1;
        players.value[players.value.indexOf(match.player2)].score += match.scoreP2;
    })
    players.value.sort((a, b) => {
        if (b.nbWins === a.nbWins) {
            return b.score - a.score;
        }
        return b.nbWins - a.nbWins;
    });
    babykonStore.players = players.value;
}

const sendResults = async () => {
    const data = {
        date: new Date().toISOString(),
        rankings: players.value.map(player => ({
            idPlayer: player.id,
            nbVictory: player.nbWins,
            rank: players.value.indexOf(player) + 1,
        })),
        nbGames: matchs.value.length
    }

    const maPromesse = new Promise(async (resolve, reject) => {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/babykon/tournament", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        resolve(response.json());
    })
    maPromesse.then((data: any) => {
        players.value.forEach(player => {
            data.forEach((results: { idPlayer: number; elo: number | undefined; }) => {
                results.idPlayer === player.id ? player.elo = results.elo : null;
            });
        });
    });
}

const getResults = async () => {
    if(await isResultsOk()) {
        openDialogModal.value = true;
    } else {
        alert('Veuillez sélectionner un gagnant pour chaque match.');
    }
}

const confirmEndGame = async (confirm: boolean) => {
    if(confirm) {
        startAnimation.value = true;
        await getRanking();
        await sendResults();
        setTimeout(() => {
            startAnimation.value = false;
            router.push({ name: 'babykon-tournament-results' });
        }, 2000);
    } else {
        openDialogModal.value = false;
    }
}

onBeforeMount(() => {
    if(matchs.value.length === 0) {
        genererMatchs(babykonStore.players);
        shuffleMatch(matchs.value);
    } else {
        players.value.forEach(player => {
            player.nbWins = 0;
            player.score = 0;
        })
    }
})
</script>

<template>
    <div class="babykon-tournament-container" v-if="!openDialogModal">
        <div class="header">
            <Header
                title="Tournoi"
                @previous-route="$router.back()"
            />
        </div>
        
        <div class="matchs-container">
            <div class="match" v-for="match in matchs" :key="match.matchId">
                <div class="opposition">
                    <div class="player" :class="{'winner': match.winnerId === match.player1.id}" @click.prevent="isWinner(match, match.player1)">
                        <img :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + match.player1.firstName + match.player1.pseudo + match.player1.name" alt="Avatar de {{ match.player1.name }}" />
                        <span>{{ match.player1.pseudo }}</span>
                    </div>
                    <div class="vs">VS</div>
                    <div class="player" :class="{'winner': match.winnerId === match.player2.id}" @click.prevent="isWinner(match, match.player2)">
                        <img :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + match.player2.firstName + match.player2.pseudo + match.player2.name" alt="Avatar de {{ match.player2.name }}" />
                        <span>{{ match.player2.pseudo }}</span>
                    </div>
                </div>
                <details class="score">
                    <summary>
                        <h3 class="see-more">saisie du score</h3>
                    </summary>
                    <div class="set-score">
                        <input type="number" :max="5" :min="-2" v-model="match.scoreP1" :id="match.player1.pseudo" :name="'Score de ' + match.player1.pseudo"/>
                        <input type="number" :max="5" :min="-2" v-model="match.scoreP2" :id="match.player2.pseudo" :name="'Score de ' + match.player2.pseudo"/>
                    </div>
                </details>
            </div>
        </div>

        <div class="babykon-tournament-end">
            <button class="btn-results" @click.prevent="getResults()">Voir les résultats</button>
        </div>
    </div>
    <Teleport to="main" v-else>
        <dialog class="confirm-end-game-dialog" open>
            <div class="loader" v-if="startAnimation">
                <LottieAnimation 
                    :animation-data="LoaderAnimation"
                    :auto-play="true"
                    :loop="true"
                    :speed="1"
                    ref="anim"
                    class="anim"
                />
            </div>
            <div class="confirm-end-game-container" v-else>
                <div class="title">Le tournoi est terminé</div>
                <div class="text">Confirmez-vous la fin du tounoi ?</div>
                <div class="btn-container">
                    <div class="btn cancel" @click.prevent="confirmEndGame(false)">Annuler</div>
                    <div class="btn end" @click.prevent="confirmEndGame(true)">Terminer</div>
                </div>
            </div>
        </dialog>
    </Teleport>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.babykon-tournament-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: var(--bg-color-primary);

    .header {
        width: 100%;
    }

    .matchs-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        gap: 1.5rem;

        .match {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            background-color: white;
            border-radius: .5rem;
            width: 100%;
            border: 1px solid lightgray;
            
            .opposition {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                width: 100%;
                padding: .5rem;
                
                .player {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 80px;
                    border: 2px solid transparent;
                    border-radius: 25%;
                    
                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                    
                    span {
                        font-family: "Tilt Warp", sans-serif;
                        margin: 5px 0;
                    }
                    
                    &.winner {
                        border: 2px solid gold;
                        border-radius: 25%;
                    }
                }
                .vs {
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 24px;
                    font-weight: bold;
                }
            }
            .score {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;

                summary {

                    &::-webkit-details-marker, &::marker {
                        display: none; 
                        content: "";
                    }

                    .see-more {
                        text-decoration: underline;
                        font-size: .75rem;
                        color: grey;
                        margin-bottom: .5rem;
                    }
                }

                .set-score {
                    display: flex;
                    justify-content: space-evenly;
                    padding: 0 1rem 1rem 1rem;
                    gap: 2rem;

                    input {
                        width: 100px;
                        height: 3rem;
                        border: 1px solid lightgray;
                        font-family: "Tilt Warp", sans-serif;
                        color: var(--text-color);
                        border-radius: .5rem;
                        text-align: center;
                        font-size: 2rem;
                        
                        &::placeholder {
                            color: grey;
                        }
                    }
                }
            }
        }
    }

    .babykon-tournament-end {
        display: flex;
        justify-content: center;
        width: 100%;

        .btn-results {
            @include btn-primary;

            & {
                width: 90%;
                margin: 1rem 0 2rem 0;
            }
        }
    }
}
</style>