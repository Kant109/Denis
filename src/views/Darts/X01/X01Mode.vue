<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useX01GameStore } from '@/stores/X01GameStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const dartGameStore = useX01GameStore();

const orderedPlayers = computed(() => JSON.parse(localStorage.getItem('orderedDartsPlayer') as string));
const players = (orderedPlayers.value as [] as Array<Player>);
const x01Mode = ref(0);

const router = useRouter();

const selectX01Mode = (selectedX01Mode: number) => {
    x01Mode.value = selectedX01Mode;
    dartGameStore.mode = selectedX01Mode.toString() as '301' | '501';
    dartGameStore.clearDraftPlayers();

    players.forEach((player: Player) => {
        const currentPlayer: X01Player = {
            id: player.id,
            pseudo: player.pseudo,
            firstname: player.firstname,
            name: player.name,
            isActive: players.indexOf(player) == 0,
            points: x01Mode.value,
            volleys: players.indexOf(player) == 0 ? [['', '', '']] : [],
            sets: 0,
            legs: 0,
            average: 0,
            nbThrows: 0,
            nbDarts: 0
        };

        dartGameStore.setPlayer(currentPlayer);
    });

    dartGameStore.startGameFromDraft();
    router.push({ name: "x01-game" })
}

const back = () => {
    router.push({ name: "darts-mode" });
}

</script>

<template>
    <div class="x01-mode-container">
        <Header title="X01" @previous-route="back" />

        <div class="x01-choice-container">
            <div class="btn-simple-mode" @click.prevent="selectX01Mode(301)">301</div>
            <div class="btn-team-mode" @click.prevent="selectX01Mode(501)">501</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.x01-mode-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;

    .x01-choice-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-around;
        width: 80%;
        gap: 2rem;

        .choice, .btn-simple-mode, .btn-team-mode {
            @include btn-primary;
        }

        .btn-cancel {
            @include btn-secondary;
        }
    }
}

</style>