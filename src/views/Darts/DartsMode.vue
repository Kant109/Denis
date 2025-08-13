<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectGamemode = (mode: string) => {
    if(mode === "cricket") {
        router.push({ name: "darts-mode-cricket" });
    } else if(mode === "x01") {
        // router.push({ name: "darts-mode-x01" });
    }
}

const back = () => { 
    router.push({ name: "darts-player" });
}

</script>

<template>
    <div class="darts-game-container">
        <Header title="FLÉCHETTES" @previous-route="back" />

        <div class="darts-game-chose-mode">
            <div class="choices-container">
                <div class="choice cricket" @click.prevent="selectGamemode('cricket')">Cricket</div>
                <div class="choice x01" @click.prevent="selectGamemode('x01')">X01</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.darts-game-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;

    .darts-game-chose-mode {
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

                &.x01 {
                    @include wip-btn;
                }
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