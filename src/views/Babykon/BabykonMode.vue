<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectGamemode = (mode: string) => {
    if(mode === "1vs1") {
        router.push({ name: "babykon-game" });
    } else if(mode === "tournament") {
        router.push({ name: "babykon-tournament-selection-player" });
    }
}

const back = () => { 
    router.push({ name: "home" });
}

</script>

<template>
    <div class="babykon-game-container">
        <Header title="BABYKON" @previous-route="back" />

        <div class="babykon-game-chose-mode">
            <div class="choices-container">
                <div class="choice" @click.prevent="selectGamemode('1vs1')">1vs1</div>
                <div class="choice" @click.prevent="selectGamemode('tournament')">Tournoi</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.babykon-game-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;

    .babykon-game-chose-mode {
        display: flex;
        justify-content: center;
        width: 100%;
        animation: appear .2s;

        .choices-container {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: space-around;
            width: 80%;
            gap: 2rem;

            .choice {
                @include btn-primary;
            }

            .btn-cancel {
                @include btn-secondary;
            }
        }
    }
}

@keyframes appear {
    0%, 80% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

</style>