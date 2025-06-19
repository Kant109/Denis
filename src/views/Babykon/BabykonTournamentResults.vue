<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useBabykonStore } from '@/stores/BabykonStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const babykonStore = useBabykonStore();

const players = computed(() => babykonStore.players);

const endTournament = () => {
    babykonStore.reset();
    router.push({ name: "home" });
}

</script>

<template>
    <div class="results-container">
        <div class="header">
            <Header title="Résultats" @previous-route="endTournament()" />
        </div>
        <div class="results-list">
            <div v-for="player in players" :key="player.id" class="player">
                <img v-if="players.indexOf(player) === 0" src="@/assets/images/1st-place-medal.svg" alt="Trophée">
                <img v-if="players.indexOf(player) === 1" src="@/assets/images/2nd-place-medal.svg" alt="Trophée">
                <img v-if="players.indexOf(player) === 2" src="@/assets/images/3rd-place-medal.svg" alt="Trophée">
                <span class="player-name">{{ player.firstName }} "{{ player.pseudo }}" {{ player.name }}</span>
                <span class="player-wins">Victoires : {{ player.nbWins }}</span>
                <span class="player-goals">Buts : {{ player.score }}</span>
                <span class="player-elo">Elo : {{ player.elo?.toFixed(0) }}</span>
            </div>
        </div>
        <div class="return-home">
            <button class="btn" @click.prevent="endTournament()">Finir le tournoi</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.results-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: var(--bg-color-primary);

    .header {
        width: 100%;
    }

    .results-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        gap: 1.5rem;

        .player {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: white;
            border-radius: .5rem;
            width: 100%;
            border: 1px solid lightgray;
            padding: 1rem;

            img {
                width: 4rem;
                height: 4rem;
                margin-bottom: 1rem;
            }
            
            .player-name {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1.5rem;
                color: var(--text-color);
                margin-bottom: .5rem;
            }
            
            .player-wins,
            .player-goals,
            .player-elo {
                font-family: "Tilt Warp", sans-serif;
                font-size: 1rem;
                color: var(--text-color);
                margin-bottom: .25rem;
            }
        }
    }

    .return-home {
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
</style>