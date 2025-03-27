<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import CricketBoard from '@/components/Cricket/CricketBoard.vue';
import CricketPlayer from '@/components/Cricket/CricketPlayer.vue';
import { useCricketGameStore } from '@/stores/CricketGameStore';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import RadioSpeaker from '@/components/RadioSpeaker.vue';
import { useManagementAppStore } from '@/stores/ManagementAppStore';

const gameStore = useCricketGameStore();
const managementAppStore = useManagementAppStore();

const players = computed(() => gameStore.players);
const isGameFinish = computed(() => gameStore.isGameFinish);
const isLastPlayerActive = ref(false);
const blur = computed(() => managementAppStore.blur);

const router = useRouter();

const setIsLastPlayerActive = (isCurrentPlayerLast: boolean) => {
    isLastPlayerActive.value = isCurrentPlayerLast;
}

const back = () => {
    gameStore.reset();
    router.push({ name: "darts-mode-cricket" });
}

const confirmBack = () => {
    managementAppStore.blur = true;
    managementAppStore.openCancelGame = true;
}

const speak = async (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.voice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.name === "") as SpeechSynthesisVoice;
        // .find((voice) => voice.name === "Microsoft Paul - French (France)") as SpeechSynthesisVoice;
    utterance.rate = 1.5;
    utterance.pitch = 1;

    utterance.onstart = () => {
        managementAppStore.displayRadioBox = true;
    };

    utterance.onend = () => {
        managementAppStore.displayRadioBox = false;
    };

    window.speechSynthesis.speak(utterance);
}

watch(
    () => isGameFinish.value,
    () => {
        managementAppStore.openConfirmEndGame = false;
        managementAppStore.blur = false;
        router.push({ name: "recap-game", params: {gameId: gameStore.gameId} });
    }
);

onMounted(async () => {
    if(gameStore.gameId === 0) {
        const performances = async () => {
            let performances = [] as Array<DartPerformance>;
                players.value.forEach(player => {

                    performances.push({
                        "idPlayer": player.id,
                        "pseudo": player.firstName,
                        "score": 0,
                        "position": players.value.indexOf(player) + 1,
                        "volley": null,
                        "numberRound": 0,
                    })
                });

            return performances;
        }

        const currentDate = async (): Promise<string> => {
            // Get current date
            const today = new Date();

            // Extract day, month, and year
            let day = today.getDate().toString();
            let month = (today.getMonth() + 1).toString();
            let year = today.getFullYear().toString();

            // Add leading zero to day and month if needed
            day = parseInt(day) < 10 ? "0" + day : day;
            month = parseInt(month) < 10 ? "0" + month : month;

            // Format the date as dd/mm/yyyy
            return day + "-" + month + "-" +year;
        }

        const data: DartGame = {
            "typeGame": "DACKT",
            "creationDate": await currentDate() ,
            "players": await performances()
        }

        const maPromesse = new Promise(async (resolve, reject) => {
            const response = await fetch(import.meta.env.VITE_BE_URL + "/dart/game", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            resolve(response.json());
        })
        maPromesse.then((data: any) => {
            gameStore.gameId = data.id;
            speak(data.commentaire);
        });
    }
})

</script>

<template>
    <RadioSpeaker />
    <Header title="CRICKET" @previous-route="confirmBack" />

    <div class="players-container" :class="{'blur': blur}">
        <div class="players-content" :class="{'lastPlayerActive': isLastPlayerActive}">
            <CricketPlayer
                v-for="player in players"
                :player="player"
                :is-top-bg-active="players.indexOf(player) !== 0"
                :is-top-bg-player-active="players[players.indexOf(player) - 1 > 0 ? players.indexOf(player) - 1 : 0].isActive === true"
                @isLastPlayer="setIsLastPlayerActive"
            />
        </div>
    </div>
    <CricketBoard @comment="(text) => speak(text)" @back="back"/>
</template>

<style lang="scss" scoped>

.points-recap-doors {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 390px;
    margin-bottom: 1rem;
    
    .recap-doors {
        display: flex;
        gap: .5rem;
        font-family: "Tilt Warp", sans-serif;
        font-size: 1rem;

        .recap-door {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            background-color: white;
            width: 1.5rem;
            aspect-ratio: 1/1;
        }
    }
}

.players-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-height: calc(100vh - 210px);
    height: 100%;
    background-color: var(--bg-color-primary);
    padding-bottom: 2rem;
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    &.blur {
        filter: blur(10px);
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }

    .players-content {
        display: flex;
        flex-direction: column;
        max-width: 390px;
        width: 100%;

        &::after {
            content: "";
            height: .75rem;
            border-radius: 0 0 1rem 1rem;
            border-bottom: 2px solid rgba(0, 0, 0, .25);
            background-color: var(--bg-color-secondary);
        }
        
        &.lastPlayerActive {
            &::after {
                background-color: var(--active-player);
            }
        }
    }
}

</style>