<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const router = useRouter();

const stats = ref([] as Array<BabykonStat>);
const allPlayers = ref([] as Array<Player>);
const selectedWinner = ref(0);
const selectedLoser = ref(0);
const scoreLoser = ref(0);
const scoreWinner = ref(0);


const back = () => {
    router.push({ name: "home" });
}

const valider = async () => {
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
    console.log("Response : " + JSON.stringify(stats)) 
}

onMounted(async () => {

// recupération des joueurs
    const url = import.meta.env.VITE_BE_URL + "/players";
    try {
        const retourPlayers = await fetch(url);
        if (!retourPlayers.ok) {
            throw new Error(`Response status: ${retourPlayers.status}`);
        }
        allPlayers.value = await retourPlayers.json();
    } catch (error: any) {
        console.error(error.message);
    }
})
</script>

<template>
    <div id="babykon-div">
        <div class="header">
            <Header title="BabyKon" @previous-route="back" />
        </div>
        <div id="score-div">
            <div id="player-div">
                <h3>Gagnant</h3>
                <div id="input-div">
                    <input type="number" id="score-input" name="scoreWinner" min="1" max="10" required v-model="scoreWinner" />
                    <select name="winner" id="player-select" v-model="selectedWinner">
                        <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{p.pseudo}}</option>
                    </select>
                </div>
            </div>
            <div id="player-div">
                <h3>Perdant</h3>
                <div id="input-div">
                    <input type="number" id="score-input" name="scoreLoser" min="1" max="10" required v-model="scoreLoser" />
                    <select name="loser" id="player-select" v-model="selectedLoser">
                        <option v-for="p in allPlayers" :key="p.id" :value="p.id">{{p.pseudo}}</option>
                    </select>
                </div>
            </div>
        </div>
        <button id="valider-btn" @click="valider()" >Valider</button>
    </div>
    <div v-if="stats.length > 0" id="success-div">
        <h1>Yes ! ça fonctionne</h1>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

#babykon-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100vw;
    min-height: 100vh;
    background-color: #e2fcfb;

    #score-div {
       background-color: #cde6e5ee;
       padding: 2rem 1rem;
       margin: 2rem 1rem;
       border-radius: 5px;
       box-shadow: inset 20px 20px 20px -20px rgba(137, 100, 100, 0.8);
       display: flex;
       justify-content: space-evenly;
       align-items: center;
       width: 90%;
    
       #player-div {
            background-color: #e2fcfb;
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
    
            #input-div {
                display: flex;
                width: 100%;
                flex-direction: column;
                justify-content: center;
                align-items: center;
    
                #score-input {
                    width: 80%;
                    height: 50px;
                    font-size: larger;
                    padding: 1rem .5rem;
                    border-radius: 5px;
                }

                #player-select {
                    width: 80%;
                    background-color: rgb(243, 243, 243);
                    padding: 1rem .5rem;
                    margin: 1rem .5rem;
                    border-radius: 5px;
                }
            }
        }
    }
    #valider-btn {  
        @include btn-primary;
        width: 80%;
    }
}

</style>