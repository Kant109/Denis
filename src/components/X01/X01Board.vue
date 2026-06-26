<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useX01GameStore } from '@/stores/X01GameStore';

const dartGameStore = useX01GameStore();
const players = computed(() => dartGameStore.players);

/* -------------------------------------------------------------------------- */
/* Modificateurs de saisie (double / triple)                                  */
/* -------------------------------------------------------------------------- */

const double = ref(false);
const triple = ref(false);

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
const lastVolley = (player: X01Player) => player.volleys[player.volleys.length - 1];

/** Une volée est vide tant qu'aucune de ses 3 fléchettes n'est saisie. */
const isVolleyEmpty = (volley: Array<string>) =>
    volley[0] === '' && volley[1] === '' && volley[2] === '';

/** Libellé d'une fléchette : "20", "D20" (double) ou "T20" (triple). */
const formatDart = (points: number, multiplier: number) =>
    multiplier === 2 ? `D${points}` : multiplier === 3 ? `T${points}` : `${points}`;

/** Score de départ selon le mode de jeu. */
const startingPoints = () => (dartGameStore.mode === '301' ? 301 : 501);

/** Active le joueur suivant (retour au premier en fin de liste) et lui ouvre une volée. */
const activateNextPlayer = (player: X01Player) => {
    const list = players.value;
    const nextIndex = (list.indexOf(player) + 1) % list.length;
    list[nextIndex].isActive = true;
    list[nextIndex].volleys.push(['', '', '']);
};

/** Termine le tour du joueur courant et passe la main au suivant. */
const passTurn = (player: X01Player) => {
    player.isActive = false;
    activateNextPlayer(player);
};

/* -------------------------------------------------------------------------- */
/* Saisie d'une fléchette                                                      */
/* -------------------------------------------------------------------------- */

const handleScore = (points: number) => {
    const multiplier = double.value ? 2 : triple.value ? 3 : 1;
    const player = players.value.find((p: X01Player) => p.isActive);

    if (player) {
        placeDart(player, points, multiplier);

        if (player.points < 0 || player.points === 1) {
            // Score impossible à finir : volée annulée (dépassement).
            bust(player, points, multiplier);
        } else if (player.points === 0) {
            if (multiplier === 2) {
                // Finition réussie sur un double : manche gagnée.
                completeLeg(player);
            } else {
                // 0 atteint sans double : la finition n'est pas valide.
                restoreScore(player, points, multiplier);
                passTurn(player);
            }
        }
    }

    resetModifiers();
};

/** Enregistre la fléchette dans la première case libre de la volée courante. */
const placeDart = (player: X01Player, points: number, multiplier: number) => {
    const volley = lastVolley(player);
    const label = formatDart(points, multiplier);

    player.points -= multiplier * points;

    if (volley[0] === '') {
        volley[0] = label;
    } else if (volley[1] === '') {
        volley[1] = label;
    } else if (volley[2] === '') {
        volley[2] = label;
        passTurn(player);
    }
};

/** Restaure le score retiré par la dernière fléchette. */
const restoreScore = (player: X01Player, points: number, multiplier: number) => {
    player.points += multiplier * points;
};

/** Dépassement : on annule le score et on marque la volée d'un "O". */
const bust = (player: X01Player, points: number, multiplier: number) => {
    restoreScore(player, points, multiplier);

    const volley = lastVolley(player);
    volley.forEach((dart, i) => {
        if (dart !== '') volley[i] = `O${dart}`;
    });

    passTurn(player);
};

/** Manche gagnée : on archive l'état, on met à jour legs/sets puis on réinitialise. */
const completeLeg = (player: X01Player) => {
    localStorage.setItem('previousDartGame', JSON.stringify(dartGameStore.$state));

    player.legs += 1;
    dartGameStore.registerLegEnd(players.value);

    if (player.legs === dartGameStore.legs) {
        player.sets += 1;
        players.value.forEach((p: X01Player) => { p.legs = 0; });

        if (player.sets === dartGameStore.sets) {
            dartGameStore.setIsGameFinish(true);
            dartGameStore.setWinner(player);
            dartGameStore.computeMatchStats();
            return;
        }
        return;
    }

    players.value.forEach((p: X01Player) => {
        p.average = 0;
        p.nbThrows = 0;
        p.nbDarts = 0;
        p.volleys = [];
        p.points = startingPoints();
    });

    passTurn(player);
};

/* -------------------------------------------------------------------------- */
/* Annulation (bouton RETOUR)                                                  */
/* -------------------------------------------------------------------------- */

const cancel = () => {
    const player = players.value.find((p: X01Player) => p.isActive);
    if (!player) return;

    // Volée unique et vide : on annule la fin de manche précédente.
    if (player.volleys.length === 0 && isVolleyEmpty(lastVolley(player))) {
        restorePreviousGame();
        return;
    }

    if (isVolleyEmpty(lastVolley(player))) {
        // Aucune fléchette dans la volée courante : on revient au joueur précédent.
        player.volleys.pop();
        player.isActive = false;

        const list = players.value;
        const previousIndex = (list.indexOf(player) - 1 + list.length) % list.length;
        list[previousIndex].isActive = true;
        removeLastDart(list[previousIndex]);
    } else {
        // On retire la dernière fléchette saisie.
        removeLastDart(player);
    }
};

/** Retire la dernière fléchette de la volée courante et restitue son score. */
const removeLastDart = (player: X01Player) => {
    const volley = lastVolley(player);

    for (let slot = 2; slot >= 0; slot--) {
        const dart = volley[slot];
        if (dart === '') continue;

        // Si la volée était marquée comme dépassée ("O"), on retire la marque.
        volley.forEach((d, i) => {
            if (d.includes('O')) volley[i] = dart.substring(1);
        });

        restoreDartScore(dart, player);
        volley[slot] = '';
        break;
    }
};

/** Re-crédite le score d'une fléchette annulée (ignorée si dépassement "O"). */
const restoreDartScore = (dart: string, player: X01Player) => {
    if (dart.includes('O')) return;
    const multiplier = dart.includes('T') ? 3 : dart.includes('D') ? 2 : 1;
    player.points += multiplier === 1 ? parseInt(dart) : multiplier * parseInt(dart.substring(1, 3));
};

/** Restaure l'état de jeu archivé avant la dernière manche puis annule le tir gagnant. */
const restorePreviousGame = () => {
    const previousDartGame = JSON.parse(localStorage.getItem('previousDartGame') as string);
    dartGameStore.$state = previousDartGame;
    localStorage.removeItem('previousDartGame');
    cancel();
};

onMounted(() => {
    dartGameStore.setWinner({} as X01Player);
});

</script>

<template>
    <div class="points-container">
        <div class="points-content">
            <div class="points-line">
                <div v-for="n in [1, 2, 3, 4, 5, 6, 7]" :key="n" class="points" @click.prevent="handleScore(n)">{{ n }}</div>
            </div>
            <div class="points-line">
                <div v-for="n in [8, 9, 10, 11, 12, 13, 14]" :key="n" class="points" @click.prevent="handleScore(n)">{{ n }}</div>
            </div>
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

    .points-content {
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem 1.5rem 1rem;
        max-width: 390px;
        width: 100%;
        gap: .5rem;

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