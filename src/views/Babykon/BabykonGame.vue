<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { usePlayerStore } from '@/stores/PlayerStore';
import { LottieAnimation } from "lottie-web-vue";
import ConfettiAnimation from "@/assets/animations/confetti.json";

const router = useRouter();

const playersStore = usePlayerStore();

const stats = ref([] as Array<BabykonStat>);
const allPlayers = ref([] as Array<Player>);
const selectedWinner = ref(0);
const selectedLoser = ref(0);
const scoreLoser = ref(0);
const scoreWinner = ref(0);
const isGameOver = ref(false);


const back = () => {
    router.push({ name: "babykon-mode" });
}

const valider = async () => {
    if(selectedWinner.value === selectedLoser.value) {
        alert("Veuillez sélectionner un gagnant, un perdant et entrer des scores valides.");
        return;
    }
    let payload : BabykonGame = {
        "idLoser": selectedLoser.value,
        "idWinner": selectedWinner.value,
        score: [scoreWinner.value, scoreLoser.value]
    }
    const retourStat = await fetch(import.meta.env.VITE_BE_URL + "/babykon/game", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
        }
    }); 
    if (!retourStat.ok) {
            throw new Error(`Response status: ${retourStat.status}`);
        }
    stats.value = await retourStat.json();
    isGameOver.value = true;
}

const regame = () => {
    isGameOver.value = false;
    selectedWinner.value = 0;
    selectedLoser.value = 0;
    scoreLoser.value = 0;
    scoreWinner.value = 0;
}

const valueList = [-2, -1, 0, 1, 2, 3, 4, 5]
const winnerValue = ref(5);
const loserValue = ref(0);

function minusWinnerValue() {
    const index = valueList.indexOf(winnerValue.value) - 1;
    winnerValue.value = valueList[index <= 0 ? 0 : index];
}

function plusWinnerValue() {
    const index = valueList.indexOf(winnerValue.value) + 1;
    winnerValue.value = valueList[index >= valueList.length - 1 ? valueList.length - 1 : index];
}

function minusLoserValue() {
    const index = valueList.indexOf(loserValue.value) - 1;
    loserValue.value = valueList[index <= 0 ? 0 : index];
}

function plusLoserValue() {
    const index = valueList.indexOf(loserValue.value) + 1;
    loserValue.value = valueList[index >= valueList.length - 1 ? valueList.length - 1 : index];
}
onMounted(async () => {
    allPlayers.value = playersStore.players;
})
</script>

<template>
    <div class="babykon-container" v-if="!isGameOver">
        <div class="header">
            <Header title="BabyKon" :made-by-matis="true" :improve-by-simon="true" @previous-route="back" />
        </div>
        <div class="score-container">
            <div class="player-container">
                <h3>Gagnant</h3>
                <div class="player-content">
                    <button class="action-btn" @click="minusWinnerValue">-</button>
                    <select v-model="winnerValue" class="value-select winner">
                        <option v-for="option in valueList" :value="option.valueOf()">{{option}}</option>
                    </select>
                    <button class="action-btn" @click="plusWinnerValue">+</button>
                </div>
                <div class="player-content">
                    <select name="winner" class="player-select" v-model="selectedWinner">
                        <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{p.firstName + ' ' + p.pseudo + ' ' + p.name}}</option>
                    </select>
                </div>
            </div>
            <div class="player-container">
                <h3>Perdant</h3>
                <div class="player-content">
                    <button class="action-btn" @click="minusLoserValue">-</button>
                    <select v-model="loserValue" class="value-select looser" name="scoreLoser">
                        <option v-for="option in valueList" :value="option.valueOf()">{{option}}</option>
                    </select>
                    <button class="action-btn" @click="plusLoserValue">+</button>
                </div>
                <div class="player-content">
                    <select name="loser" class="player-select" v-model="selectedLoser">
                        <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{p.firstName + ' ' + p.pseudo + ' ' + p.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <button class="valider-btn" @click="valider()" >Valider</button>
        <div v-if="stats.length > 0" class="success-div">
            <h1>Yes ! ça fonctionne</h1>
        </div>
    </div>
    <div v-else class="end-game-container">
        <h1>Partie terminée</h1>
        <div class="end-game-content">
            <div class="recap-container">
                <LottieAnimation
                    class="animation"
                    :animation-data="ConfettiAnimation"
                    :auto-play="true"
                    :loop="false"
                    :speed="0.8"
                    ref="anim"/>
                <img src="@/assets/images/trophy_3d.png" alt="Trophée">
                <div class="player-presentation">
                    <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' +  allPlayers.find(p => p.id === selectedWinner)?.firstName +  allPlayers.find(p => p.id === selectedWinner)?.pseudo +  allPlayers.find(p => p.id === selectedWinner)?.name" alt="Avatar">
                    <div class="text">{{ allPlayers.find(p => p.id === selectedWinner)?.pseudo }}</div>
                </div>
                <div class="player-stat">
                    <img src="@/assets/images/star.svg" alt="Elo">
                    <div class="text">{{ stats.find(p => p.idPlayer === selectedWinner)?.elo.toFixed(0) }}</div>
                    <img src="@/assets/images/cup.svg" alt="Nombre de victoire">
                    <div class="text">{{ stats.find(p => p.idPlayer === selectedWinner)?.nbVictory }}</div>
                    <img src="@/assets/images/shield-bad.svg" alt="Nombre de défaite">
                    <div class="text">{{ stats.find(p => p.idPlayer === selectedWinner)?.nbGame! - stats.find(p => p.idPlayer === selectedWinner)?.nbVictory! }}</div>
                </div>
            </div>
            <div class="recap-container">
                <div class="player-presentation">
                    <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' +  allPlayers.find(p => p.id === selectedLoser)?.firstName +  allPlayers.find(p => p.id === selectedLoser)?.pseudo +  allPlayers.find(p => p.id === selectedLoser)?.name" alt="Avatar">
                    <div class="text">{{ allPlayers.find(p => p.id === selectedLoser)?.pseudo }}</div>
                </div>
                <div class="player-stat">
                    <img src="@/assets/images/star.svg" alt="Elo">
                    <div class="text">{{ stats.find(p => p.idPlayer === selectedLoser)?.elo.toFixed(0) }}</div>
                    <img src="@/assets/images/cup.svg" alt="Nombre de victoire">
                    <div class="text">{{ stats.find(p => p.idPlayer === selectedLoser)?.nbVictory }}</div>
                    <img src="@/assets/images/shield-bad.svg" alt="Nombre de défaite">
                    <div class="text">{{ stats.find(p => p.idPlayer === selectedLoser)?.nbGame! - stats.find(p => p.idPlayer === selectedLoser)?.nbVictory! }}</div>
                </div>
            </div>
        </div>
        <button class="valider-btn" @click="regame">Rejouer</button>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.babykon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;
    background-color: #a4eeeb;

    h1 {
        font-family: "Honk", system-ui;
        font-size: 3rem;
    }

    .score-container {
       background-color: #64d4d1ee;
       padding: 2rem 1rem;
       margin: 2rem 1rem;
       border-radius: 5px;
       box-shadow: inset 20px 20px 20px -20px rgba(137, 100, 100, 0.8);
       display: flex;
       justify-content: space-between;
       align-items: center;
       width: 90%;
    
       .player-container {
            background-color: #a4eeeb;
            padding: .5rem .5rem;
            border-radius: 5px;
            margin: 5px;
            box-shadow:  20px 20px 20px -20px rgba(137, 100, 100, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 45%;

            h3 {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.5rem;
                color: var(--text-color);
            }
    
            .player-content {
                display: flex;
                width: 100%;
                flex-direction: row;
                justify-content: center;
                align-items: center;
    
                .score-input {
                    width: 80%;
                    height: 50px;
                    font-size: larger;
                    padding: 1rem .5rem;
                    border-radius: 5px;
                    text-align: center;
                    font-family: "Sixtyfour Convergence", sans-serif;
                    font-size: 2rem;

                    &.winner {
                        color: rgb(4, 100, 4);
                    }

                    &.looser {
                        color: rgb(158, 3, 3);
                    }
                }

                .player-select, .value-select {
                    width: 100%;
                    background-color: rgb(243, 243, 243);
                    padding: 1rem .5rem;
                    margin: 1rem .5rem;
                    border-radius: 5px;
                    text-align: center;
                }

                .value-select {
                    text-align: center;
                    color: rgb(249 0 0);
                    font-family: "Sixtyfour Convergence", sans-serif;
                    font-size: 2rem;
                    background-color: rgb(104 214 211);
                    border: none;
                    box-shadow: inset 16px 15px 18px -20px rgba(137, 100, 100, 0.8);
                    appearance: none;
                    padding-left: 10px;
                }
            }
        }
        @media only screen and (max-width: 800px) {
            .player-container {
                width: 90%;
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
    flex-direction: column;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    min-width: 100vw;
    min-height: 100vh;
    background-color: #a4eeeb;

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

            .player-presentation{
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            .player-stat{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-items: auto;
                background-color: #a4eeeb;
                box-shadow:  20px 20px 20px -20px rgba(137, 100, 100, 0.8);
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

            img {
                width: 6rem;
                height: 6rem;

            }

            .animation {
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }

    .valider-btn {
        @include btn-primary;

        & {
            margin-top: 1.5rem;
            width: 80%;
        }
    }
}

</style>