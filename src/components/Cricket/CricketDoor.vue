<script setup lang="ts">
import type { CricketDoorNumber } from '@/interfaces/CricketDoorNumber';
import { computed } from 'vue';

enum State {
    None = 0,
    Simple,
    Double,
    Triple
}

const props = defineProps<{
  number: CricketDoorNumber
  hit: number,
  volley: string[] | null
}>(); 

const volleyActualHitNumber = computed(() => props.volley?.filter((v) => v == props.number.toString())?.length ?? 0);
const isValidHit = computed(() => props.volley != null && props.hit > 0 && volleyActualHitNumber.value > 0 );
const volleyHitSimple = computed(() => isValidHit.value && props.hit > State.None && (props.hit - volleyActualHitNumber.value < State.Simple || props.hit > State.Triple));
const volleyHitDouble = computed(() => isValidHit.value && props.hit > State.Simple && (props.hit - volleyActualHitNumber.value < State.Double || props.hit > State.Triple));
const volleyHitTriple = computed(() => isValidHit.value && props.hit > State.Double && (props.hit - volleyActualHitNumber.value < State.Triple || props.hit > State.Triple));

</script>
<template>
    <div class="door" :class="{
        'simple': hit > State.None, 
        'volley-hit-simple': volleyHitSimple, 
        'double': hit > State.Simple, 
        'volley-hit-double': volleyHitDouble, 
        'triple': hit > State.Double,
        'volley-hit-triple': volleyHitTriple }">
    </div>
</template>
<style lang="scss" scoped>
.door {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--cricket-door-disable);
    border-radius: 50%;
    height: 1.5rem;
    width: 1.5rem;
    position: relative;

    &::before, &::after {
        content: '';
        position: absolute;
        width: 100%;
        background-color: var(--cricket-door-disable);
        height: 2px;
    }

    &::before {
        transform: rotate(45deg);
    }
    &::after {
        transform: rotate(-45deg);
    }

    &.simple {
        &::after {
            background-color: var(--cricket-door-confirm) !important;
        }
    }
    &.simple.volley-hit-simple {
        &::after {
            background-color: #0089ff !important;
        }
    }
    &.double {
        &::before {
            background-color: var(--cricket-door-confirm) !important;
        }
    }
    &.double.volley-hit-double {
        &::before {
            background-color: #0089ff !important;
        }
    }
    &.triple {
        border: 2px solid var(--cricket-door-confirm) !important;
    }
    &.triple.volley-hit-triple {
        border: 2px solid #0089ff !important;
    }
}
</style>