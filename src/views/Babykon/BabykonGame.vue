<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/stores/PlayerStore';
import { LottieAnimation } from "lottie-web-vue";
import ConfettiAnimation from "@/assets/animations/confetti.json";
import BabykonPlayer from './BabykonPlayer.vue';

const router = useRouter();

const playersStore = usePlayerStore();

const stats = ref([] as Array<BabykonStat>);
const allPlayers = ref([] as Array<Player>);
const scoreLoser = ref(0);
const scoreWinner = ref(0);
const isGameOver = ref(false);

const winner = ref({} as Player);
const loser = ref({} as Player);

const openSearchPlayer = ref(false);
const isSelectPlayerOne = ref(true);

const back = () => {
    router.push({ name: "babykon-mode" });
}

const valider = async () => {
    if (!winner.value.id || !loser.value.id) {
        alert("Veuillez sélectionner un gagnant, un perdant et entrer des scores valides.");
        return;
    }
    const payload: BabykonGame = {
        "idLoser": loser.value.id,
        "idWinner": winner.value.id,
        score: [scoreWinner.value, scoreLoser.value]
    }
    const retourStat = await fetch(`${import.meta.env.VITE_BE_URL}/babykon/game`,
        {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    if (!retourStat.ok) {
        throw new Error(`Response status: ${retourStat.status}`);
    }
    stats.value = await retourStat.json();
    isGameOver.value = true;
}

const replay = () => {
    isGameOver.value = false;
    scoreLoser.value = 0;
    scoreWinner.value = 5;
}

onMounted(async () => {
    allPlayers.value = playersStore.players;
});

const selectPlayer = (player: Player) => {
    if (isSelectPlayerOne.value) {
        winner.value = player;
    } else {
        loser.value = player;
    }
    openSearchPlayer.value = false;
}

const invertPlayer = () => {
    const tempWinner = winner.value;
    winner.value = loser.value;
    loser.value = tempWinner;
}
</script>

<template>
    <div class="babykon-container" v-if="!isGameOver">
        <div class="header">
            <Header title="BabyKon" @previous-route="back" />
        </div>
        <div class="score-container">
            <div class="player-container">
                <BabykonPlayer title="Gagnant" :player="winner" :default-value="5"
                    @select-player="(n) => { isSelectPlayerOne = true; openSearchPlayer = true; scoreWinner = n }"
                    @score-change="(n) => scoreWinner = n" />
                <div class="d-flex justify-content-center">
                    <img v-if="winner.id && loser.id" class="invert-player-img" @click="invertPlayer"
                        src="@/assets/images/sync.svg" width="30" height="30" />
                </div>
                <BabykonPlayer title="Perdant" :player="loser"
                    @select-player="(n) => { isSelectPlayerOne = false; openSearchPlayer = true; scoreLoser = n }"
                    @score-change="(n) => scoreLoser = n" />
            </div>
        </div>
        <div class="w-100 d-flex justify-content-center">
            <button class="valider-btn" @click="valider()">Valider</button>
        </div>
    </div>
    <div v-else class="babykon-container end-game-container">
        <h1 class="text-center">Partie terminée</h1>
        <div class="end-game-content">
            <div class="recap-container"
                style="    animation-name: scale-animation;   animation-duration: 1.2s;    animation-iteration-count: infinite;">
                <LottieAnimation class="animation" :animation-data="ConfettiAnimation" :auto-play="true" :loop="false"
                    :speed="0.8" ref="anim" />
                <div class="player-presentation">
                    <img src="@/assets/images/trophy_3d.png" alt="Trophée" height="60">
                    <img class="player-img" width="100" height="100"
                        :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${winner.firstName}${winner.pseudo}${winner.name}`"
                        alt="Avatar" />
                    <div class="text">{{ winner?.pseudo }}</div>
                </div>
                <div class="player-stat">
                    <img src="@/assets/images/star.svg" alt="Elo">
                    <div class="text">{{stats.find(p => p.idPlayer === winner.id)?.elo.toFixed(0)}}</div>
                    <img src="@/assets/images/cup.svg" alt="Nombre de victoire">
                    <div class="text">{{stats.find(p => p.idPlayer === winner.id)?.nbVictory}}</div>
                    <img src="@/assets/images/shield-bad.svg" alt="Nombre de défaite">
                    <div class="text">{{stats.find(p => p.idPlayer === winner.id)?.nbGame! - stats.find(p =>
                        p.idPlayer
                        === winner.id)?.nbVictory!}}</div>
                </div>
            </div>
            <div class="d-flex align-items-center" style="gap:1rem;">
                <div class="score"> {{ scoreWinner }}</div>
                <span class="score-separator">VS</span>
                <div class="score">{{ scoreLoser }}</div>
            </div>
            <div class="recap-container">
                <div class="player-presentation">
                    <img class="player-img" width="100" height="100"
                        :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${loser.firstName}${loser.pseudo}${loser.name}`"
                        alt="Avatar" />
                    <div class="text">{{allPlayers.find(p => p.id === loser.id)?.pseudo}}</div>
                </div>
                <div class="player-stat">
                    <img src="@/assets/images/star.svg" alt="Elo">
                    <div class="text">{{stats.find(p => p.idPlayer === loser.id)?.elo.toFixed(0)}}</div>
                    <img src="@/assets/images/cup.svg" alt="Nombre de victoire">
                    <div class="text">{{stats.find(p => p.idPlayer === loser.id)?.nbVictory}}</div>
                    <img src="@/assets/images/shield-bad.svg" alt="Nombre de défaite">
                    <div class="text">{{stats.find(p => p.idPlayer === loser.id)?.nbGame! - stats.find(p =>
                        p.idPlayer
                        === loser.id)?.nbVictory!}}</div>
                </div>
            </div>
        </div>
        <div class="btn-container w-100 d-flex justify-content-center">
            <button class="valider-btn" @click="replay">Rejouer</button>
            <button class="back-btn" @click="back">Accueil</button>
        </div>
    </div>
    <dialog class="search-player-dialog" :open="openSearchPlayer">
        <div class="content">
            <div class="dialog-title">
                Sélectionner le {{ isSelectPlayerOne ? "gagnant" : "perdant" }}
                <span class="dialog-close" @click="openSearchPlayer = false">x</span>
            </div>
            <div class="search-player">
                <div class="select-player-container">
                    <div class="select-player d-flex"
                        v-for="player in allPlayers.filter(p => p.id !== winner.id && p.id !== loser.id)"
                        @click="selectPlayer(player)">
                        <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' +
                            player.firstName +
                            player.pseudo +
                            player.name
                            " alt="Avatar" />
                        <div class="player-name">
                            <div class="player-name-pseudo">
                                {{
                                player.pseudo.length > 18
                                ? player.pseudo.substring(0, 18) + ".."
                                : player.pseudo
                                }}
                            </div>
                            <div class="player-full-name">
                                {{
                                player.firstName.length + player.name.length > 18
                                ? (player.firstName + " " + player.name).substring(
                                0,
                                18
                                ) + ".."
                                : player.firstName + " " + player.name
                                }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.dialog-title {
    font-size: 1.2em;

    .dialog-close {
        padding: 0.5em;
        position: absolute;
        right: 0;
        top: 0;
        font-size: 1rem;
    }
}

.search-player-dialog {
    width: 90%;
    max-height: 85vh;
    border-radius: 0.5rem;
    border: none;
    position: absolute;
    top: 15vw;
    overflow: hidden;
}

.select-player-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    grid-auto-rows: minmax(10px, auto);

    .select-player {
        background-color: var(--bg-color-primary);
        height: auto;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.5rem;
        padding: 0.5rem 0;
        background-color: var(--bg-color-primary);
        border: 5px solid var(--bg-color-primary);
        border-radius: 0.5rem;
        font-family: "Tilt Warp", sans-serif;
        font-size: 0.8rem;

        .player-img {
            height: 3rem;
            width: 3rem;
            border-radius: 50%;
            background-color: white;
            cursor: pointer;
        }
    }
}

.invert-player-img {
    transform: rotate(-90deg);
}

.babykon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;
    background-color: #a4eeeb;
    justify-content: space-between;

    h1 {
        font-family: "Honk", system-ui;
        font-size: 3rem;
    }

    .player-container {
        display: flex;
        flex-direction: column;
        gap: .5rem;

        .player-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 0.2rem 0.1rem;
            border-radius: 0.5rem;
            font-family: "Tilt Warp", sans-serif;
            font-size: 0.8rem;

            .player-img {
                height: 3rem;
                width: 3rem;
                border-radius: 50%;
                background-color: white;
                cursor: pointer;
            }
        }
    }

    @media only screen and (max-width: 800px) {
        .score-container {
            flex-direction: column
        }
    }

    .valider-btn {
        @include btn-primary;

        & {
            margin: 1rem 0;
            width: 80%;
        }
    }

    .action-btn {
        @include btn-primary;

        & {
            width: 40%;
            font-size: 2em;
            min-width: 40px;
            margin: 0.2em;
        }
    }

    .success-div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        text-align: center;
    }
}

.end-game-container {
    h1 {
        font-family: "Honk", system-ui;
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .end-game-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        margin-left: 2rem;
        margin-right: 2rem;

        .recap-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: .5rem;
            background-color: #64d4d1ee;
            box-shadow: inset 20px 20px 20px -20px rgba(137, 100, 100, 0.8);
            width: 100%;
            padding: 2rem;
            gap: .5rem;

            .player-presentation {
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            .player-stat {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-items: auto;
                background-color: #a4eeeb;
                box-shadow: 20px 20px 20px -20px rgba(137, 100, 100, 0.8);
                border-radius: 3rem;
                padding: 1rem;

                img {
                    display: flex;
                    height: 1.5rem;
                    width: 1.5rem;
                    border-radius: 50%;
                    margin-right: 0.2rem;
                    margin-left: 0.4rem;

                }

                .text {
                    font-family: "Tilt Warp", sans-serif;
                    font-size: 1.2rem;
                    color: var(--text-color);
                }

            }

            .player-img {
                display: flex;
                height: 4rem;
                width: 4rem;
                border-radius: 50%;
                margin-right: 1rem;
            }

            .text {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.8rem;
                color: var(--text-color);
            }

            .animation {
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }

    .score {
        background-color: white;
        padding: 0.5rem 1rem;
        font-size: 1.5rem;
        border-radius: .5rem;
        font-family: "Tilt Warp", sans-serif;
    }

    .score-separator {
        font-family: "Tilt Warp", sans-serif;
    }

    .btn-container {
        gap: .2em;

        .valider-btn,
        .back-btn {
            @include btn-primary;

            & {
                margin: .5rem;
                width: 80%;
            }
        }
    }
}
</style>