<script setup lang="ts">
import Header from '@/components/Header.vue';
import Podium from '@/components/ranking/podium.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getPlayerRankingLibelle, winrate } from "@/common/PlayerUtil";
import { LottieAnimation } from 'lottie-web-vue';
import LoaderAnimation from "@/assets/animations/loader.json";

const selectedSport = ref("dart");
const players = ref([] as Array<PlayerRanking>);
const topTreePlayers = ref([] as Array<PlayerRanking>);

const router = useRouter();
const sports = [
    {code: 'dart', name: "Flechette"},
    {code: "babykon", name: "Babykon"}
];

const getRanking = async (sport: string) => {
    const url = import.meta.env.VITE_BE_URL + "/ranking/" + sport;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const res = await response.json();
        players.value = res.classements;
        topTreePlayers.value = players.value.slice(0,3);
    } catch (error: any) {
        console.error(error.message);
    }
}

const previousRoute = () => {
    router.push({ name:"home" });
}

const sportIcon = (name: String) => {
    if(name === "dart") {
        return '🎯'
    } else if(name === 'babykon') {
        return '⚽';
    }
}

// const winrate = (nbGame: number, nbWin: number) => {
//     return Math.round(nbWin / nbGame * 100);
// }

onBeforeMount(() => {
    selectedSport.value = localStorage.getItem('sports-ranking-denis') !== null ? localStorage.getItem('sports-ranking-denis') as string : 'dart';
    getRanking(selectedSport.value);
})

watch(
    () => selectedSport.value,
    () => getRanking(selectedSport.value)
)

</script>

<template>
    <div class="ranking-container">
        <Header
            title="Classement"
            @previous-route="previousRoute"/>
        <p class="select-sport">
            <label for="sport-select">Choisis un sport:</label>
            
            <select name="sport" id="sport-select" v-model="selectedSport">
                <button>
                    <selectedcontent></selectedcontent>
                </button>
                <option v-for="sport in sports" :key="sport.code" :value="sport.code">
                    <span class="icon" aria-hidden="true">{{ sportIcon(sport.code) }}</span>
                    <span class="option-label">{{ sport.name }}</span>
                </option>
            </select>
        </p>
        <Podium v-if="players.length > 0" :top-tree-players="topTreePlayers" />
        <hr/>
        <div v-if="players.length > 0" class="ranking-content">
            <details class="players" v-for="player in players">
                <summary class="player-summary">
                    <span class="position">{{ players.indexOf(player) + 1 }}</span>
                    <div class="name">
                        {{ player.lastName }} <span>"{{ player.pseudo }}"</span> {{ player.name }}
                    </div>
                    <div class="elo">
                        {{ player.elo }}
                    </div>
                </summary>
                <div class="player-stats">
                    <span class="nb-victory">
                        {{  `🏆 ${winrate(player.nbGame, player.nbVictory)} %`  }}
                    </span>
                    <span class="nb-defeat">
                        {{ `${player.nbGame} parties` }}
                    </span>
                </div>
            </details>
        </div>
        <LottieAnimation v-if="players.length <= 0" class="animation" :animation-data="LoaderAnimation" :auto-play="true" :loop="true" :speed="0.8" ref="anim" />
    </div>
</template>

<style lang="scss" scoped>

.ranking-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: var(--bg-color-primary);

    .select-sport {

        label {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;
            color: var(--text-color);
            margin-bottom: .5rem;
            padding: 0 1em;
        }

        select {
            height: 2rem;
            border: 1px solid lightgray;
            font-family: "Tilt Warp", sans-serif;
            color: var(--text-color);
            border-radius: .5rem;
            text-align: center;
            flex: 1;

            option {
                font-family: "Tilt Warp", sans-serif;
                color: var(--text-color);
            }
        }
        select,
            ::picker(select) {
            appearance: base-select;
            }
        }

    .ranking-content {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
        padding: .5rem;
        border-radius: 12px;
        background-color: var(--bg-color-secondary);

        .players[open] > summary {
            height: auto
        }

        .players {
            background-color: var(--bg-color-primary);
            border-radius: 8px;
            cursor: pointer;
            font-family: "Playpen Sans", sans-serif;
            font-size: 0.8rem;
            position: relative;


            .player-summary {
                display: flex;
                justify-content: space-between;
                margin: .5rem;
                align-items: center;

                .position {
                    font-family: "Tilt Warp", sans-serif;
                }

                .elo {
                    justify-content: flex-end;
                    font-weight: 700;
                    background-color: white;
                    border-radius: 12px;
                    padding: 0 .5em;
                }

                .name {
                    gap: .5rem;

                    span {
                        font-weight: 300;
                    }
                }
            }

            .player-stats {
                display: flex;
                justify-content: space-around;
                margin: 0.5rem 0;
            }
        }
    }
}

</style>