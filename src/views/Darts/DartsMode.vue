<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useX01GameStore } from '@/stores/X01GameStore';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const dartGameStore = useX01GameStore();

const gamemode = ref('');

const router = useRouter();

const selectGamemode = (mode: string) => {
    gamemode.value = mode;
    if(mode === "cricket") {
        startGame();
    }
}

const startGame = () => {
    if(gamemode.value === "cricket") {
        router.push({ name: "darts-mode-cricket" });
    } else if(gamemode.value === "x01") {
        localStorage.setItem("dartNbLegs", dartGameStore.legs.toString());
        localStorage.setItem("dartNbSets", dartGameStore.sets.toString());
        router.push({ name: "darts-mode-x01" });
    }
}

const back = () => { 
    router.push({ name: "darts-player" });
}

onBeforeMount(() => {
    localStorage.getItem("dartNbLegs") && (dartGameStore.legs = parseInt(localStorage.getItem("dartNbLegs")!));
    localStorage.getItem("dartNbSets") && (dartGameStore.sets = parseInt(localStorage.getItem("dartNbSets")!));
})

</script>

<template>
    <div class="darts-game-container">
        <Header title="FLÉCHETTES" @previous-route="back" />

        <div class="darts-game-chose-mode">
            <div class="choices-container" v-if="gamemode === ''">
                <div class="choice cricket" @click.prevent="selectGamemode('cricket')">Cricket</div>
                <div class="choice x01" @click.prevent="selectGamemode('x01')">X01</div>
                <div class="choice wip">WIP</div>
            </div>
            <div v-if="gamemode === 'x01'" class="sets-and-legs-container">
                <div class="sets-and-legs">
                    <div class="sets">
                        <label for="set-select">Sets :</label>

                        <select name="sets" id="set-select" v-model="dartGameStore.sets">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div class="legs">
                        <label for="leg-select">Legs :</label>
    
                        <select name="legs" id="leg-select" v-model="dartGameStore.legs">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                </div>
                <div class="start-game" @click.prevent="startGame">Commencer</div>
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

                &.wip {
                    @include wip-btn;
                }
            }

            .btn-cancel {
                @include btn-secondary;
            }
        }

        .sets-and-legs-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-top: 2rem;

            .sets-and-legs {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                width: 50%;
                gap: 1rem;

                .sets, .legs {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: .5rem;
                    width: 100%;

                    select {
                        padding: .5rem;
                        border-radius: .5rem;
                        border: 1px solid #ccc;
                        font-size: 1rem;
                        width: 50%;
                        text-align: center
                    }
                }
            }

            .start-game {
                @include btn-primary;

                & {
                    margin-top: 2rem;
                }
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