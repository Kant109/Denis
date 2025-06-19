<script setup lang="ts">
import Header from '@/components/Header.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const nbTeamsValueList = [2, 3, 4, 5];
const nbPlayerValueList = [1, 2, 3];
const nbTeams = ref(null as number | null);
const nbPlayer = ref(null as number | null);

const startGame = () => {
    router.push({ name: "petanque-game" });
}

const back = () => { 
    router.push({ name: "home" });
}

</script>

<template>
    <div class="petanque-mode-container">
        <Header title="PETANQUE" :sponsored-by-ricard="true" @previous-route="back" />

        <div class="petanque-mode-chose-mode">
            <div class="select-nb-teams">
                <h2>Choix du nombre d'équipes</h2>
                <select v-model="nbTeams" class="value-select">
                    <option v-for="nbTeam in nbTeamsValueList" :value="nbTeam.valueOf()">{{ nbTeam }}</option>
                </select>
            </div>
            <div class="select-nb-players" v-if="nbTeams !== null">
                <h2>Nombres de joueurs par équipe ?</h2>
                <select v-model="nbPlayer" class="value-select">
                    <option v-for="nbPlayer in nbPlayerValueList" :value="nbPlayer.valueOf()">{{ nbPlayer }}</option>
                </select>
            </div>

            <div class="sponsor">
                <img src="@/assets/images/ricard.svg" alt="Ricard" />
                <p>Sponsored by Ricard</p>
            </div>

            <div class="start-game" v-if="nbTeams !== null && nbPlayer !== null">
                <button class="btn" @click.prevent="startGame()">Commencer la partie</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.petanque-mode-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;

    .petanque-mode-chose-mode {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        animation: appear .2s;

        .select-nb-teams, .select-nb-players {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2rem;

            .value-select {
                width: 100%;
                padding: 1rem .5rem;
                margin: 1rem .5rem;
                border-radius: .5rem;
                text-align: center;
                font-family: "Tilt Warp", sans-serif;
                font-size: 2rem;
                border: 1px solid black;
                appearance: none;
            }
        }

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

        .sponsor {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2rem;

            img {
                width: 10rem;
                height: 10rem;
            }

            p {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.5rem;
                color: var(--text-color);
                margin-top: 1rem;
            }
        }

        .start-game {
            display: flex;
            justify-content: center;
            width: 100%;
            padding-bottom: 2rem;

            .btn {
                @include btn-primary;

                & {
                    width: 90%;
                    margin-top: 1rem;;
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