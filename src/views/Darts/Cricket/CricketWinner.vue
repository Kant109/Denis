<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCricketGameStore } from "@/stores/CricketGameStore";
import { computed, onBeforeMount, ref } from "vue";
import { register } from 'swiper/element/bundle';
import { useManagementAppStore } from "@/stores/ManagementAppStore";

const gameStore = useCricketGameStore();
const managementAppStore = useManagementAppStore();

const players = computed(() => gameStore.players);
const chartDataLoaded = ref(false);

const router = useRouter();

const replay = () => {
    gameStore.reset();
    router.push({ name: "darts-player"});
}

const backHome = () => {
    gameStore.reset();
    router.push({ name: "home"});
}

onBeforeMount(async () => {
    register();
    try {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/dart/stat/game/" + gameStore.gameId + "/detail?typeGame=DACKT");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const cricketGameStats = await response.json();

        players.value.forEach(player => {
            let evolutionScore = cricketGameStats.evolutionScore[player.id];
            evolutionScore.push(player.points.total);

            player.chartData = {
                title: {
                    text: 'Évolution de votre position et score',
                    align: 'center'
                },
                yAxis: [
                    {
                        allowDecimals: false,
                        labels: {
                            format: '{value}',
                            style: {
                                color: "#0000FF"
                            }
                        },
                        title: {
                            text: 'Score',
                            style: {
                                color: "#0000FF"
                            }
                        },
                        opposite: true,
                        min: 0
                    },
                    {
                        allowDecimals: false,
                        labels: {
                            format: '{value}',
                            style: {
                                color: "#FF0000"
                            }
                        },
                        title: {
                            text: 'Position',
                            style: {
                                color: "#FF0000"
                            }
                        },
                        min: 0
                    }
                ],
                series: [
                    {
                        name: "Position",
                        yAxis: 1,
                        data: cricketGameStats.evolutionPosition[player.id],
                        color: "#FF0000",
                    },
                    {
                        name: "Score",
                        data: evolutionScore,
                        color: "#0000FF",
                        zoneAxis: 'x',
                        zones: [{
                            value: cricketGameStats.evolutionPosition[player.id].length - 1
                        }, {
                            dashStyle: 'dot'
                        }]
                    }
                ]
            }
        });

        (cricketGameStats.players as Array<PlayerStats>).forEach(playerGameStat => {
            players.value.forEach(player => {
                if(player.id === playerGameStat.idPlayer) {
                    player.elo = playerGameStat.eloScore;
                }
            })
        })

        chartDataLoaded.value = true;
    } catch (error: any) {
        console.error(error.message);
    }
    managementAppStore.computeData = false;
})

</script>

<template>
    <div class="end-game-container">
        <img class="close" src="@/assets/images/thin-close.svg" alt="Close" @click.prevent="backHome">
        <swiper-container
            :navigation="true"
            class="mySwiper"
        >
            <swiper-slide v-for="player in players">
                <div class="end-game-player-content">
                    <div class="winner-content">
                        <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstName + player.pseudo + player.name" alt="Avatar"></img>
                        <div class="player-info">
                            <div class="player-info-pseudo">{{ player.pseudo }}</div>
                            <div class="player-info-full-name">{{ player.firstName }} {{ player.name.toUpperCase() }}</div>
                        </div>
                    </div>
                    <div class="game-stats">
                        <div class="player-position">Position : {{ players.indexOf(player) + 1 }} <sup v-if="players.indexOf(player) === 0">er</sup><sup v-else>ème</sup>/ {{ players.length }}</div>
                        <div class="player-elo">Classement Elo : {{ player.elo !== undefined ? Math.round(player.elo[0]) : "" }}&nbsp;<img v-if="((player.elo !== undefined) && (player.elo.length > 1)) && player.elo[1] < player.elo[0]" src="@/assets/images/chevron-up-green.svg" alt=""><img v-if="((player.elo !== undefined) && (player.elo.length > 1)) && player.elo[1] > player.elo[0]" src="@/assets/images/chevron-down-red.svg" alt="">&nbsp;{{ ((player.elo !== undefined) && (player.elo.length > 1)) ? " ("  + (player.elo[0] - player.elo[1] < 0 ? player.elo[0] - player.elo[1] : `+${ player.elo[0] - player.elo[1] }`) + ")" : "" }}</div>
                    </div>
                    <div class="stats-container" v-if="chartDataLoaded">
                        <highcharts :options="player.chartData"></highcharts>
                    </div>
                    <div class="btn-replay" @click.prevent="replay">Rejouer</div>
                </div>
            </swiper-slide>
        </swiper-container>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.end-game-container {
    position: relative;
    width: 100%;
    background-color: var(--bg-color-primary);

    .close {
        position: absolute;
        z-index: 999;
        top: 1.5rem;
        right: 1.5rem;
        width: 2rem;
        height: 2rem;
    }

    .mySwiper {
        height: 100%;
    }
    
    .end-game-player-content { 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        min-width: calc(100% - 2rem);
        min-height: calc(100% - 2rem);
        background-color: white;
        margin: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid rgba(0, 0, 0, .25);

        .winner-content {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;

            .player-img {
                display: flex;
                height: 10rem;
                width: 10rem;
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

        .game-stats {
            display: flex;
            flex-direction: column;
        }

        .player-position, .player-elo {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;
            color: var(--text-color);
            text-align: center;
            margin: 1rem 0;

            &:is(.player-elo) {
                display: flex;
                align-items: center;
                
                img {
                    height: 1.5rem;
                    width: 1.5rem;
                }
            }
        }

        .stats-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .btn-replay {
            @include btn-primary;
            & {
                width: 80%;
                margin-top: 1rem;
            }
        }
    }
}
</style>