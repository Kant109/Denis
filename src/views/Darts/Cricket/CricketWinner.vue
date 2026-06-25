<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCricketGameStore } from "@/stores/CricketGameStore";
import { computed, ref } from "vue";

const gameStore = useCricketGameStore();

const players = computed(() => gameStore.players);

const router = useRouter();

const replay = () => {
    gameStore.reset();
    router.push({ name: "darts-player"});
}

const backHome = () => {
    gameStore.reset();
    router.push({ name: "home"});
}

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
                        <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstname + player.pseudo + player.name" alt="Avatar"></img>
                        <div class="player-info">
                            <div class="player-info-pseudo">{{ player.pseudo }}</div>
                            <div class="player-info-full-name">{{ player.firstname }} {{ player.name.toUpperCase() }}</div>
                        </div>
                    </div>
                    <div class="game-stats">
                        <div class="player-position">Position : {{ players.indexOf(player) + 1 }} <sup v-if="players.indexOf(player) === 0">er</sup><sup v-else>ème</sup>/ {{ players.length }}</div>
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