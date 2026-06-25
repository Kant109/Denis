<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCricketGameStore } from '@/stores/CricketGameStore';
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import { LottieAnimation } from "lottie-web-vue";
import DartsAnimation from "../../assets/animations/stats.json";

const gameStore = useCricketGameStore();
const managementAppStore = useManagementAppStore();

const players = computed(() => gameStore.players);
const isGameFinish = computed(() => gameStore.isGameFinish);
const blur = computed(() => managementAppStore.blur);
const openCancelGame = computed(() => managementAppStore.openCancelGame);
const openConfirmEndGame = computed(() => managementAppStore.openConfirmEndGame);
const computeData = computed(() => managementAppStore.computeData);

const double = ref(false);
const triple = ref(false);
const numberRound = ref(1);

const emit = defineEmits(['comment', 'back']);

/** Numéros jouables au Cricket (la cible doit être ouverte 3 fois pour être fermée). */
type CricketNumber = 20 | 19 | 18 | 17 | 16 | 15 | 25;
const CRICKET_NUMBERS: CricketNumber[] = [20, 19, 18, 17, 16, 15, 25];
const isCricketNumber = (n: number): n is CricketNumber => CRICKET_NUMBERS.includes(n as CricketNumber);

/* -------------------------------------------------------------------------- */
/* Modificateurs de saisie (double / triple)                                  */
/* -------------------------------------------------------------------------- */

const toggleDouble = () => {
    triple.value = false;
    double.value = !double.value;
};

const toggleTriple = () => {
    double.value = false;
    triple.value = !triple.value;
};

const resetModifiers = () => {
    double.value = false;
    triple.value = false;
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Dernière volée (groupe de 3 fléchettes) du joueur. */
const lastVolley = (player: CricketPlayer) => player.volleys[player.volleys.length - 1];

/** Une volée est vide tant qu'aucune de ses 3 fléchettes n'est saisie. */
const isVolleyEmpty = (volley: Array<string>) =>
    volley[0] === '' && volley[1] === '' && volley[2] === '';

/** Libellé d'une fléchette : "20", "D20" (double) ou "T20" (triple). */
const formatDart = (points: number, multiplier: number) =>
    multiplier === 2 ? `D${points}` : multiplier === 3 ? `T${points}` : `${points}`;

/* -------------------------------------------------------------------------- */
/* Score des adversaires (numéro fermé puis re-touché)                         */
/* -------------------------------------------------------------------------- */

/** Crédite `n` points aux adversaires qui n'ont pas encore fermé la cible. */
const addPointsToOpponents = (n: CricketNumber) => {
    players.value.forEach(player => {
        if (!player.isActive && player.doors[n] < 3) {
            player.points[n] += n;
            player.points.total += n;
        }
    });
};

/** Annule `n` points chez les adversaires qui n'avaient pas fermé la cible. */
const removePointsFromOpponents = (n: CricketNumber) => {
    players.value.forEach(player => {
        if (!player.isActive && player.doors[n] < 3) {
            player.points[n] -= n;
            player.points.total -= n;
        }
    });
};

/* -------------------------------------------------------------------------- */
/* Classement / fin de partie                                                  */
/* -------------------------------------------------------------------------- */

/** Vrai si le joueur a fermé toutes les cibles (3 touches chacune). */
const playerCloseAllDoors = (player: CricketPlayer): boolean =>
    CRICKET_NUMBERS.every(n => player.doors[n] >= 3);

/** Vrai si le joueur a le plus petit score (ou 0). */
const playerHasLowestScore = (player: CricketPlayer): boolean => {
    if (player.points.total === 0) return true;
    return players.value.every(other => other.id === player.id || player.points.total <= other.points.total);
};

/**
 * Calcule la position de chaque joueur. On ajoute aux scores des points "virtuels"
 * pour les cibles non fermées afin de classer les joueurs entre eux.
 */
const getPlayersPosition = async (): Promise<CricketPlayer[]> => {
    const ranked = JSON.parse(JSON.stringify(players.value)) as Array<CricketPlayer>;

    ranked.forEach(player => {
        CRICKET_NUMBERS.forEach(n => {
            const remaining = 3 - player.doors[n];
            if (remaining > 0) player.points.total += remaining * n;
        });
    });

    ranked.sort((a, b) => a.points.total - b.points.total);

    players.value.forEach(player => {
        const rankedPlayer = ranked.find(p => p.id === player.id);
        if (rankedPlayer) player.position = ranked.indexOf(rankedPlayer) + 1;
    });

    return ranked;
};

const checkIsGameFinish = async () => {
    await getPlayersPosition();
    if (isGameFinish.value) return;

    players.value.forEach(player => {
        if (playerCloseAllDoors(player) && playerHasLowestScore(player)) {
            managementAppStore.openConfirmEndGame = true;
            managementAppStore.blur = true;
            gameStore.winnerPlayer = player;
        }
    });
};

/* -------------------------------------------------------------------------- */
/* Passage de tour                                                             */
/* -------------------------------------------------------------------------- */

/** Termine le tour du joueur courant et active le suivant (nouvelle manche si on boucle). */
const passTurnToNext = (player: CricketPlayer) => {
    player.isActive = false;
    const list = players.value;
    const index = list.indexOf(player);

    if (index + 1 === list.length) {
        list[0].isActive = true;
        list[0].volleys.push(['', '', '']);
        numberRound.value++;
    } else {
        list[index + 1].isActive = true;
        list[index + 1].volleys.push(['', '', '']);
    }
};

/* -------------------------------------------------------------------------- */
/* Saisie d'une fléchette                                                      */
/* -------------------------------------------------------------------------- */

const handleScore = async (points: number) => {
    const multiplier = double.value ? 2 : triple.value ? 3 : 1;
    const player = players.value.find(p => p.isActive);

    if (player) {
        if (isCricketNumber(points)) {
            registerDartOnDoor(player, points, multiplier);
        }
        await recordDart(player, formatDart(points, multiplier));
    }

    setTimeout(() => checkIsGameFinish(), 200);
    resetModifiers();
};

/** Ouvre la cible `n` (autant de fois que le multiplicateur) et marque les adversaires si déjà fermée. */
const registerDartOnDoor = (player: CricketPlayer, n: CricketNumber, multiplier: number) => {
    for (let i = 0; i < multiplier; i++) {
        player.doors[n] += 1;
        if (player.doors[n] > 3) {
            addPointsToOpponents(n);
        }
    }
};

/** Enregistre la fléchette dans la première case libre de la volée courante. */
const recordDart = async (player: CricketPlayer, label: string) => {
    const volley = lastVolley(player);

    if (volley[0] === '') {
        volley[0] = label;
    } else if (volley[1] === '') {
        volley[1] = label;
    } else if (volley[2] === '') {
        volley[2] = label;
        await finishVolley(player);
    }
};

/** Volée terminée : envoie la manche au serveur si c'est le dernier joueur, puis passe la main. */
const finishVolley = async (player: CricketPlayer) => {
    const isLastPlayer = players.value.indexOf(player) === players.value.length - 1;

    if (isLastPlayer) {
        await getPlayersPosition();
        sendRound(buildPerformances());
    }

    passTurnToNext(player);
};

/** Construit le récap des performances de la manche courante pour tous les joueurs. */
const buildPerformances = (): DartPerformance[] =>
    players.value.map(player => {
        const volley = lastVolley(player);
        return {
            idPlayer: player.id,
            pseudo: player.firstname,
            score: player.points.total,
            position: player.position,
            volley: `${volley[0]}-${volley[1]}-${volley[2]}`,
            numberRound: numberRound.value,
        };
    });

/* -------------------------------------------------------------------------- */
/* Appels serveur                                                              */
/* -------------------------------------------------------------------------- */

const sendRound = async (performances: DartPerformance[]) => {
    const data: DartRound = {
        idGame: gameStore.gameId,
        numberRound: numberRound.value,
        performances,
    };

    const response = await fetch(import.meta.env.VITE_BE_URL + "/dart/game/round", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    emit("comment", result.comment);
};

const endGame = async () => {
    await getPlayersPosition();

    const data: DartRound = {
        idGame: gameStore.gameId,
        numberRound: numberRound.value,
        performances: buildPerformances(),
    };

    try {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/dart/game/end", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
};

/* -------------------------------------------------------------------------- */
/* Annulation (bouton RETOUR)                                                  */
/* -------------------------------------------------------------------------- */

/** Annule l'effet d'une fléchette sur les cibles (referme la cible et reprend les points donnés). */
const cancelDart = (dart: string, player: CricketPlayer) => {
    const number = CRICKET_NUMBERS.find(n => dart.includes(String(n)));
    if (number === undefined) return;

    const multiplier = dart.includes('T') ? 3 : dart.includes('D') ? 2 : 1;
    const before = player.doors[number];

    for (let i = before; i > before - multiplier; i--) {
        player.doors[number] -= 1;
        if (i > 3) {
            removePointsFromOpponents(number);
        }
    }
};

/** Retire la dernière fléchette saisie de la volée courante et annule son effet. */
const removeLastDart = (player: CricketPlayer) => {
    const volley = lastVolley(player);

    for (let slot = 2; slot >= 0; slot--) {
        if (volley[slot] !== '') {
            cancelDart(volley[slot], player);
            volley[slot] = '';
            break;
        }
    }
};

const cancel = () => {
    // Rien à annuler tout au début de partie.
    if (players.value[0].volleys.length === 1 && players.value[0].volleys[0][0] === '') {
        return;
    }

    const list = players.value;
    const player = list.find(p => p.isActive);
    if (!player) return;

    if (!isVolleyEmpty(lastVolley(player))) {
        // On retire la dernière fléchette du joueur courant.
        removeLastDart(player);
    } else {
        // Volée courante vide : on revient au joueur précédent.
        player.isActive = false;
        const previousIndex = list.indexOf(player) - 1 >= 0 ? list.indexOf(player) - 1 : list.length - 1;
        list[previousIndex].isActive = true;
        removeLastDart(list[previousIndex]);

        // Si on remonte d'une manche complète, on supprime la volée vide du 1er joueur.
        if (previousIndex === list.length - 1) {
            list[0].volleys.pop();
            numberRound.value--;
        }
    }
};

/* -------------------------------------------------------------------------- */
/* Dialogues de confirmation                                                   */
/* -------------------------------------------------------------------------- */

const confirmEndGame = async (confirm: boolean) => {
    if (confirm) {
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
};

const confirmCancelGame = async (confirm: boolean) => {
    managementAppStore.openCancelGame = false;
    managementAppStore.blur = false;
    if (confirm) {
        emit('back');
    }
};

onMounted(() => {
    gameStore.winnerPlayer = {} as CricketPlayer;
    cancel();
});

</script>

<template>
    <div class="points-container" :class="{'blur': blur}">
        <div class="points-content">
            <div class="points-line">
                <div v-for="n in [15, 16, 17, 18, 19, 20]" :key="n" class="points" @click.prevent="handleScore(n)">{{ n }}</div>
                <div class="points" :class="{'isDisable': triple}" @click.prevent="handleScore(25)">25</div>
            </div>
            <div class="instructions">
                <div class="points zero" :class="{'isDisable': double || triple}" @click.prevent="handleScore(0)">0</div>
                <div class="specific">
                    <div class="points double" :class="{'isActive': double && !triple}" @click.prevent="toggleDouble">DOUBLE</div>
                    <div class="points triple" :class="{'isActive': triple && !double}" @click.prevent="toggleTriple">TRIPLE</div>
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