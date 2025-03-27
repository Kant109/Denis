<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCricketGameStore } from '@/stores/CricketGameStore';
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import { LottieAnimation } from "lottie-web-vue";
import DartsAnimation from "../../assets/animations/stats.json";

const gameStore = useCricketGameStore();
const managementAppStore = useManagementAppStore();

const players = computed(() => gameStore.players);
const double = ref(false);
const triple = ref(false);
const isGameFinish = computed(() => gameStore.isGameFinish);
const numberRound = ref(1);
const blur = computed(() => managementAppStore.blur);
const openCancelGame = computed(() => managementAppStore.openCancelGame);
const openConfirmEndGame = computed(() => managementAppStore.openConfirmEndGame);
const computeData = computed(() => managementAppStore.computeData);

const emit = defineEmits(['comment', 'back']);

const selectDouble = () => {
    if(triple.value) {
        triple.value = false;
    }
    double.value = !double.value;
}

const selectTriple = () => {
    if(double.value) {
        double.value = false;
    }
    triple.value = !triple.value;
}

const setPoints = async (points: number) => {
    players.value.forEach(player => {
        if(!player.isActive) {
            switch(points) {
                case 20:
                    if(player.doors[20] < 3) {
                        player.points[20] += 20;
                        player.points.total += 20;
                    }
                    break;
                case 19:
                    if(player.doors[19] < 3) {
                        player.points[19] += 19;
                        player.points.total += 19;
                    }
                    break;
                case 18:
                    if(player.doors[18] < 3) {
                        player.points[18] += 18;
                        player.points.total += 18;
                    }
                    break;
                case 17:
                    if(player.doors[17] < 3) {
                        player.points[17] += 17;
                        player.points.total += 17;
                    }
                    break;
                case 16:
                    if(player.doors[16] < 3) {
                        player.points[16] += 16;
                        player.points.total += 16;
                    }
                    break;
                case 15:
                    if(player.doors[15] < 3) {
                        player.points[15] += 15;
                        player.points.total += 15;
                    }
                    break;
                case 25:
                    if(player.doors[25] < 3) {
                        player.points[25] += 25;
                        player.points.total += 25;
                    }
                    break;
            }
        }
    })
}

const playerCloseAllDoors = async (player: CricketPlayer): Promise<boolean> => {
    return player.doors[20] >= 3 && player.doors[19] >= 3 && player.doors[18] >= 3 && player.doors[17] >= 3 && player.doors[16] >= 3 && player.doors[15] >= 3 && player.doors[25] >= 3;
}

const getPlayersPosition = async (): Promise<CricketPlayer[]> => {
    let orderedPlayersByPoints = JSON.parse(JSON.stringify(players.value)) as Array<CricketPlayer>;

    orderedPlayersByPoints.forEach(player => {
        player.points.total += (player.doors[25] - 3 < 0 ? (3 - player.doors[25]) * 25 : 0);
        player.points.total += (player.doors[20] - 3 < 0 ? (3 - player.doors[20]) * 20 : 0);
        player.points.total += (player.doors[19] - 3 < 0 ? (3 - player.doors[19]) * 19 : 0);
        player.points.total += (player.doors[18] - 3 < 0 ? (3 - player.doors[18]) * 18 : 0);
        player.points.total += (player.doors[17] - 3 < 0 ? (3 - player.doors[17]) * 17 : 0);
        player.points.total += (player.doors[16] - 3 < 0 ? (3 - player.doors[16]) * 16 : 0);
        player.points.total += (player.doors[15] - 3 < 0 ? (3 - player.doors[15]) * 15 : 0);
    });

    orderedPlayersByPoints.sort((j1: CricketPlayer, j2: CricketPlayer) => j1.points.total - j2.points.total);

    players.value.forEach(player => {
        orderedPlayersByPoints.forEach(orderedPlayer => {
            if(player.id === orderedPlayer.id) {
                player.position = orderedPlayersByPoints.indexOf(orderedPlayer) + 1;
            }
        })
    });

    return orderedPlayersByPoints;
}

const playerWithLessPoints = async (player: CricketPlayer): Promise<boolean> => {
    if(player.points.total === 0) return true;

    let res = true
    players.value.forEach(otherPlayer => {
        if((player.id !== otherPlayer.id) && player.points.total > otherPlayer.points.total) {
            res = false;
        }
    });
    return res;

}

const checkIsGameFinish = async () => {
    await getPlayersPosition();

    if(!isGameFinish.value) {
        players.value.forEach(async player => {
            if(await playerCloseAllDoors(player) && await playerWithLessPoints(player)) {
                managementAppStore.openConfirmEndGame = true;
                managementAppStore.blur = true;
                gameStore.winnerPlayer = player;
                return;
            }
        });
    }
}

const setPointsActivePlayer = async (points: number) => {
    const value = double.value ? 2 : triple.value ? 3 : 1;
    let activePlayerPointsVolley = true;

    players.value.forEach(async player => {
        if(player.isActive && activePlayerPointsVolley) {
            const currentPointValue = value === 2 ? "D" + points.toString() : value === 3 ? "T" + points.toString() : points.toString();

            switch(points) {
                case 20:
                    for (let index = 0; index < value; index++) {
                        player.doors[20] += 1;
                        if(player.doors[20] > 3) {
                            await setPoints(20);
                        }
                    }
                    break;
                case 19:
                    for (let index = 0; index < value; index++) {
                        player.doors[19] += 1;
                        if(player.doors[19] > 3) {
                            await setPoints(19);
                        }
                    }
                    break;
                case 18:
                    for (let index = 0; index < value; index++) {
                        player.doors[18] += 1;
                        if(player.doors[18] > 3) {
                            await setPoints(18);
                        }
                    }
                    break;
                case 17:
                    for (let index = 0; index < value; index++) {
                        player.doors[17] += 1;
                        if(player.doors[17] > 3) {
                            await setPoints(17);
                        }
                    }
                    break;
                case 16:
                    for (let index = 0; index < value; index++) {
                        player.doors[16] += 1;
                        if(player.doors[16] > 3) {
                            await setPoints(16);
                        }
                    }
                    break;
                case 15:
                    for (let index = 0; index < value; index++) {
                        player.doors[15] += 1;
                        if(player.doors[15] > 3) {
                            await setPoints(15);
                        }
                    }
                    break;
                case 25:
                    for (let index = 0; index < value; index++) {
                        player.doors[25] += 1;
                        if(player.doors[25] > 3) {
                            await setPoints(25);
                        }
                    }
                    break;
            }

            if(player.volleys[player.volleys.length - 1][0] === "") {
                player.volleys[player.volleys.length - 1][0] = currentPointValue;
            } else if(player.volleys[player.volleys.length - 1][1] === "") {
                player.volleys[player.volleys.length - 1][1] = currentPointValue;
            } else if(player.volleys[player.volleys.length - 1][2] === "") {
                player.volleys[player.volleys.length - 1][2] = currentPointValue;

                if(players.value.indexOf(player) === players.value.length - 1) {
                    let performances = [] as Array<DartPerformance>;
                    
                    await getPlayersPosition();

                    players.value.forEach(player => {

                        performances.push({
                            "idPlayer": player.id,
                            "pseudo": player.firstName,
                            "score": player.points.total,
                            "position": player.position,
                            "volley": player.volleys[player.volleys.length - 1][0] + "-" + player.volleys[player.volleys.length - 1][1] + "-" + player.volleys[player.volleys.length - 1][2],
                            "numberRound": numberRound.value,
                        })
                    });
                    sendRound(performances);
                }

                player.isActive = false;
                if(players.value.indexOf(player) + 1 === players.value.length) {
                    players.value[0].isActive = true;
                    players.value[0].volleys.push(['', '', '']);
                    numberRound.value++;
                } else {
                    players.value[players.value.indexOf(player) + 1].isActive = true;
                    players.value[players.value.indexOf(player) + 1].volleys.push(['', '', '']);
                }
                activePlayerPointsVolley = false;
            }
        }
    });

    setTimeout(async () => {
        await checkIsGameFinish();
    }, 200);
    
    reset();
}

const sendRound = async (performances: DartPerformance[]) => {
    const data: DartRound = {
        "idGame": gameStore.gameId,
        "numberRound": numberRound.value,
        "performances": performances,
    }

    const maPromesse = new Promise(async (resolve, reject) => {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/dart/game/round", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        resolve(response.json());
    })
    maPromesse.then((data: any) => {
        emit("comment", data.comment);
    });
}

const endGame = async () => {
    let performances = [] as Array<DartPerformance>;

    const pointsPlayers = await getPlayersPosition();

    players.value.forEach(player => {

        performances.push({
            "idPlayer": player.id,
            "pseudo": player.firstName,
            "score": pointsPlayers[players.value.indexOf(player)].points.total,
            "position": player.position,
            "volley": player.volleys[player.volleys.length - 1][0] + "-" + player.volleys[player.volleys.length - 1][1] + "-" + player.volleys[player.volleys.length - 1][2],
            "numberRound": numberRound.value,
        })
    });

    const data: DartRound = {
        "idGame": gameStore.gameId,
        "numberRound": numberRound.value,
        "performances": performances,
    }

    try {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/dart/game/end", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}

const removePoints = async (points: number) => {
    players.value.forEach(player => {
        if(!player.isActive) {
            switch(points) {
                case 20:
                    if(player.doors[20] < 3) {
                        player.points[20] -= 20;
                        player.points.total -= 20;
                    }
                    break;
                case 19:
                    if(player.doors[19] < 3) {
                        player.points[19] -= 19;
                        player.points.total -= 19;
                    }
                    break;
                case 18:
                    if(player.doors[18] < 3) {
                        player.points[18] -= 18;
                        player.points.total -= 18;
                    }
                    break;
                case 17:
                    if(player.doors[17] < 3) {
                        player.points[17] -= 17;
                        player.points.total -= 17;
                    }
                    break;
                case 16:
                    if(player.doors[16] < 3) {
                        player.points[16] -= 16;
                        player.points.total -= 16;
                    }
                    break;
                case 15:
                    if(player.doors[15] < 3) {
                        player.points[15] -= 15;
                        player.points.total -= 15;
                    }
                    break;
                case 25:
                    if(player.doors[25] < 3) {
                        player.points[25] -= 25;
                        player.points.total -= 25;
                    }
                    break;
            }
        }
    })
}

const cancelPoints = async (previousDart: string, player: CricketPlayer) => {
    const value = previousDart.includes('T') ? 3 : previousDart.includes('D') ? 2 : 1;

    if(previousDart.includes('20')) {
        const nbDartsInPoints = player.doors[20];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[20] -= 1;
            if(index > 3) {
                await removePoints(20);
            }
        }
    } else if(previousDart.includes('19')) {
        const nbDartsInPoints = player.doors[19];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[19] -= 1;
            if(index > 3) {
                await removePoints(19);
            }
        }
    } else if(previousDart.includes('18')) {
        const nbDartsInPoints = player.doors[18];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[18] -= 1;
            if(index > 3) {
                await removePoints(18);
            }
        }
    } else if(previousDart.includes('17')) {
        const nbDartsInPoints = player.doors[17];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[17] -= 1;
            if(index > 3) {
                await removePoints(17);
            }
        }
    } else if(previousDart.includes('16')) {
        const nbDartsInPoints = player.doors[16];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[16] -= 1;
            if(index > 3) {
                await removePoints(16);
            }
        }
    } else if(previousDart.includes('15')) {
        const nbDartsInPoints = player.doors[15];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[15] -= 1;
            if(index > 3) {
                await removePoints(15);
            }
        }
    } else if(previousDart.includes('25')) {
        const nbDartsInPoints = player.doors[25];

        for (let index = nbDartsInPoints; index > nbDartsInPoints - value; index--) {
            player.doors[25] -= 1;
            if(index > 3) {
                await removePoints(25);
            }
        }
    }
}

const removePreviousDart = async (player: CricketPlayer, isCancel: boolean) => {
    for (let index = 3; index > 0; index--) {
        const previousDart = player.volleys[player.volleys.length - 1][index - 1];

        if(previousDart !== "" && !isCancel) {
            await cancelPoints(previousDart, player);

            player.volleys[player.volleys.length - 1][index - 1] = "";
            isCancel = true;
        }
    }
}

const cancel = () => {
    if(players.value[0].volleys.length === 1 && players.value[0].volleys[0][0] === "") {
        return;
    }
    let isCancel = false;
    players.value.forEach(player => {
        if(!player.isActive) {
            return;
        }
        if(!(player.volleys[player.volleys.length - 1][0] === "" && player.volleys[player.volleys.length - 1][1] === "" && player.volleys[player.volleys.length - 1][2] === "")) {
            removePreviousDart(player, isCancel);
            isCancel = true;
        } else {
            player.isActive = false;
            const playerIndex = (players.value.indexOf(player) - 1) >= 0 ? players.value.indexOf(player) - 1 : players.value.length - 1;

            players.value[playerIndex].isActive = true;
            removePreviousDart(players.value[playerIndex], isCancel);

            if(playerIndex === players.value.length - 1) {
                players.value[0].volleys.pop();
                numberRound.value--;
            }
            
            isCancel = true;
        }
    });
}

const reset = () => {
    double.value = false;
    triple.value = false;
}

const confirmEndGame = async (confirm: boolean) => {
    if(confirm) {
        managementAppStore.computeData = true;
        setTimeout(async () => {
            await endGame();
            gameStore.isGameFinish = true;
            gameStore.players = await getPlayersPosition();
        }, 2500);
    } else {
        cancel();
        managementAppStore.openConfirmEndGame = false;
        managementAppStore.blur = false;
    }
}

const confirmCancelGame = async (confirm: boolean) => {
    managementAppStore.openCancelGame = false;
    managementAppStore.blur = false;
    if(confirm) {
        emit('back');
    }
}

onMounted(() => {
    gameStore.winnerPlayer = {} as CricketPlayer;
    cancel();
})

</script>

<template>
    <div class="points-container" :class="{'blur': blur}">
        <div class="points-content">
            <div class="points-line">
                <div class="points" @click.prevent="setPointsActivePlayer(15)">15</div>
                <div class="points" @click.prevent="setPointsActivePlayer(16)">16</div>
                <div class="points" @click.prevent="setPointsActivePlayer(17)">17</div>
                <div class="points" @click.prevent="setPointsActivePlayer(18)">18</div>
                <div class="points" @click.prevent="setPointsActivePlayer(19)">19</div>
                <div class="points" @click.prevent="setPointsActivePlayer(20)">20</div>
                <div class="points" :class="{'isDisable': triple}" @click.prevent="setPointsActivePlayer(25)">25</div>
            </div>
            <div class="instructions">
                <div class="points zero" :class="{'isDisable': double || triple}" @click.prevent="setPointsActivePlayer(0)">0</div>
                <div class="specific">
                    <div class="points double" :class="{'isActive': double && !triple}" @click.prevent="selectDouble">DOUBLE</div>
                    <div class="points triple" :class="{'isActive': triple && !double}" @click.prevent="selectTriple">TRIPLE</div>
                    <div class="points back" @click.prevent="cancel">RETOUR</div>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="main">
        <dialog class="confirm-end-game-dialog" :open="openConfirmEndGame || openCancelGame">
            <div class="loader" v-if="computeData">
                <LottieAnimation 
                    :animation-data="DartsAnimation"
                    :auto-play="true"
                    :loop="true"
                    :speed="1"
                    ref="anim"
                    class="anim"
                />
            </div>
            <div class="confirm-end-game-container" v-else>
                <div class="title">{{openCancelGame ? "Annulation de partie" : "Un joueur a terminé"}}</div>
                <div class="text">{{openCancelGame ? "Êtes-vous sûr de vouloir annuler la partie ?" : "Confirmez-vous la fin de la partie ?"}}</div>
                <div class="btn-container">
                    <div v-if="openConfirmEndGame" class="btn cancel" @click.prevent="confirmEndGame(false)">Annuler</div>
                    <div v-if="openConfirmEndGame" class="btn end" @click.prevent="confirmEndGame(true)">Terminer</div>
                    <div v-if="openCancelGame" class="btn cancel" @click.prevent="confirmCancelGame(false)">Annuler</div>
                    <div v-if="openCancelGame" class="btn end" @click.prevent="confirmCancelGame(true)">Confimer</div>
                </div>
            </div>


        </dialog>
    </Teleport>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.points-container {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--bg-color-secondary);
    --tw-shadow: inset 0 5px 0 0 rgba(0, 0, 0, .25);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-ring-shadow, 0 0 rgba(0, 0, 0, 0)), var(--tw-shadow);

    &.blur {
        filter: blur(10px);
    }

    .points-content {
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem 1.5rem 1rem;
        max-width: 390px;
        width: 100%;

        .points-line {
            display: flex;
            justify-content: space-between;

            .points {
                aspect-ratio: 1/1;
                @include points;
            }
        }

        .instructions {
            display: flex;
            margin-top: .5rem;
            gap: 0.45rem;

            .points {
                aspect-ratio: 1/1;
                @include points;
            }

            .specific {
                display: flex;
                flex-direction: row;
                width: 100%;
                gap: 0.45rem;

                .points{
                    &.double, &.triple, &.back {
                        width: 100%;
                        padding: 0 .5rem 5px 0.5rem;

                        &.isActive {
                            color: rgba(black, .25);
                            box-shadow: none;
                        }
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 389px) {
    .points-container {
        .points-content {
            max-width: 320px;
            width: 100%;
            padding: 1rem .5rem 1.5rem .5rem;
        }
    }
}

</style>