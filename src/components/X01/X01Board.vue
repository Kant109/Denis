<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useX01GameStore } from '@/stores/X01GameStore';

const dartGameStore = useX01GameStore();

const players = computed(() => dartGameStore.players);
const double = ref(false);
const triple = ref(false);

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

const setPointsActivePlayer = async (points: number) => {
    const value = (double.value ? 2 : triple.value ? 3 : 1) as 1 | 2 | 3;
    dartGameStore.applyThrow(points, value);
    reset();
}

const cancel = () => {
    dartGameStore.undoThrow();
}

const reset = () => {
    double.value = false;
    triple.value = false;
}

onMounted(() => {
    dartGameStore.setWinner({} as X01Player);
    cancel();
})

</script>

<template>
    <div class="points-container">
        <div class="points-content">
            <div class="points-line">
                <div class="points" @click.prevent="setPointsActivePlayer(1)">1</div>
                <div class="points" @click.prevent="setPointsActivePlayer(2)">2</div>
                <div class="points" @click.prevent="setPointsActivePlayer(3)">3</div>
                <div class="points" @click.prevent="setPointsActivePlayer(4)">4</div>
                <div class="points" @click.prevent="setPointsActivePlayer(5)">5</div>
                <div class="points" @click.prevent="setPointsActivePlayer(6)">6</div>
                <div class="points" @click.prevent="setPointsActivePlayer(7)">7</div>
            </div>
            <div class="points-line">
                <div class="points" @click.prevent="setPointsActivePlayer(8)">8</div>
                <div class="points" @click.prevent="setPointsActivePlayer(9)">9</div>
                <div class="points" @click.prevent="setPointsActivePlayer(10)">10</div>
                <div class="points" @click.prevent="setPointsActivePlayer(11)">11</div>
                <div class="points" @click.prevent="setPointsActivePlayer(12)">12</div>
                <div class="points" @click.prevent="setPointsActivePlayer(13)">13</div>
                <div class="points" @click.prevent="setPointsActivePlayer(14)">14</div>
            </div>
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