<script setup lang="ts">
import Header from '@/components/Header.vue';
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const selectedSport = ref("");
const players = ref([] as Array<PlayerRanking>);

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
    } catch (error: any) {
        console.error(error.message);
    }
}

const previousRoute = () => {
    router.push({ name:"home" });
}

onBeforeMount(() => {
    selectedSport.value = localStorage.getItem('sports-ranking-denis') !== null ? localStorage.getItem('sports-ranking-denis') as string : 'dart';
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
            @previous-route="previousRoute"
        />
        <div class="select-sport">
            <label for="sport-select">Choisis un sport:</label>
            
            <select name="sport" id="sport-select" v-model="selectedSport">
                <option v-for="sport in sports" :key="sport.code" :value="sport.code">{{sport.name}}</option>
            </select>
        </div>
        <div class="ranking-content">
            <div class="players" v-for="player in players">
                <div class="position">
                    {{ players.indexOf(player) + 1 }}
                </div>
                <div class="name">
                    {{ player.lastName }} <span>"{{ player.pseudo }}"</span> {{ player.name }}
                </div>
                <div class="elo">
                    {{ player.elo }}
                </div>
            </div>
        </div>
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
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0 1rem;

        label {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;
            color: var(--text-color);
            margin-bottom: .5rem;
        }

        select {
            width: 100%;
            height: 2rem;
            border: 1px solid lightgray;
            font-family: "Tilt Warp", sans-serif;
            color: var(--text-color);
            border-radius: .5rem;
            text-align: center;

            option {
                font-family: "Tilt Warp", sans-serif;
                color: var(--text-color);
            }
        }
    }

    .ranking-content {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        width: 100%;
        padding: 1rem;

        .players {
            display: grid;
            grid-template-columns: 10% 60% 30%;
            align-items: center;
            width: 100%;
            min-height: 3rem;
            position: relative;
            background-color: var(--bg-color-secondary);
            border-radius: 8px;
            cursor: pointer;
            font-family: "Playpen Sans", sans-serif;
            font-size: 1rem;

            .position, .name, .elo {
                display: flex;
                flex-direction: row;

                &:is(.position) {
                    margin-left: .5rem;
                    font-weight: 700;
                }

                &:is(.name) {
                    gap: .5rem;
                    span {
                        font-weight: 300;
                    }
                }

                &:is(.elo) {
                    justify-content: flex-end;
                    margin-right: .5rem;
                    font-weight: 700;
                }
            }
        }
    }
}

</style>