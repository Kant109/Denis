<script setup lang="ts">
import { computed } from 'vue';
import { useCricketGameStore } from '@/stores/CricketGameStore';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const cricketGameStore = useCricketGameStore();

const orderedPlayers = computed(() => JSON.parse(localStorage.getItem('orderedDartsPlayer') as string));
const players = (orderedPlayers.value as [] as Array<Player>);

const router = useRouter();

const selectCricketMode = (selectedCricketMode: string) => {
    if(selectedCricketMode === 'simple') {
        players.forEach((player: Player) => {
            const currentPlayer: CricketPlayer = {
                id: player.id,
                pseudo: player.pseudo,
                firstname: player.firstname,
                name: player.name,
                isActive: players.indexOf(player) == 0,
                points: {
                    20: 0,
                    19: 0,
                    18: 0,
                    17: 0,
                    16: 0,
                    15: 0,
                    25: 0,
                    total: 0
                },
                doors: {
                    20: 0,
                    19: 0,
                    18: 0,
                    17: 0,
                    16: 0,
                    15: 0,
                    25: 0
                },
                volleys: players.indexOf(player) === 0 ? [['', '', '']] : [],
                position: orderedPlayers.value.indexOf(player) + 1
            };

            cricketGameStore.players.push(currentPlayer);
        });
        router.push({ name: "cricket-game" })
    } else if(selectedCricketMode === 'team') {
        // router.push({ name: "cricket-team-mode" })
    }
}

const back = () => {
    router.push({ name: "darts-mode" });
}

</script>

<template>
    <div class="cricket-mode-container">
        <Header title="CRICKET" @previous-route="back" />

        <div class="cricket-choice-container">
            <div class="btn-simple-mode" @click.prevent="selectCricketMode('simple')">Simple</div>
            <div class="btn-team-mode" @click.prevent="selectCricketMode('team')">Équipe</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.cricket-mode-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;

    .cricket-choice-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-around;
        width: 80%;
        gap: 2rem;

        .btn-simple-mode, .btn-team-mode {
            @include btn-primary;

            &.btn-team-mode {
                @include wip-btn;
            }
        }

        .btn-cancel {
            @include btn-secondary;
        }
    }
}

</style>