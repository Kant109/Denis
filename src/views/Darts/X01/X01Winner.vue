<script setup lang="ts">
import { LottieAnimation } from "lottie-web-vue";
import ConfettiAnimation from "@/assets/animations/confetti.json";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useX01GameStore } from "@/stores/X01GameStore";

const gameStore = useX01GameStore();

const winnerPlayer = gameStore.winnerPlayer;
const nbDarts = ref(0);

const router = useRouter();

const back = () => {
    gameStore.setIsGameFinish(false);
    gameStore.setWinner({} as X01Player);
    router.push({ name: "x01-game"});
}

const replay = () => {
    
}

onMounted(() => {
    winnerPlayer.volleys.forEach(volley => {
        if(volley.includes("")) {
            volley.forEach(dart => {
                if(dart !== "") nbDarts.value++;
            });
        } else {
            nbDarts.value += 3;
        }
    });
})

</script>

<template>
    <div class="winning-container">
        <LottieAnimation
            class="animation"
            :animation-data="ConfettiAnimation"
            :auto-play="true"
            :loop="true"
            :speed="1"
            ref="anim"
        />
        <div class="winner-content">
            <img class="back" src="@/assets/images/chevron.svg" alt="Retour" @click.prevent="back">
            <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + winnerPlayer.firstName + winnerPlayer.pseudo + winnerPlayer.name" alt="Avatar"></img>
            <div class="player-info">
                <div class="player-info-pseudo">{{ winnerPlayer.pseudo }}</div>
                <div class="player-info-full-name">{{ winnerPlayer.firstName }} {{ winnerPlayer.name.toUpperCase() }}</div>
            </div>
        </div>
        <div class="btn-replay" @click.prevent="replay">Rejouer</div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.winning-container { 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-bottom: 3rem;

    .animation {
        position: absolute;
        top: 0;
        left: 0;
    }

    .winner-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 2rem 0;
        position: relative;

        .back {
            position: absolute;
            left: 0;
            top: 1rem;
            transform: rotate(180deg);
            width: 1.5rem;
            height: 1.5rem;
            margin-left: .5rem;
        }

        .player-img {
            display: flex;
            height: 10rem;
            width: 10rem;
            border-radius: 50%;
            background-color: white;
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

    #chart {
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
</style>