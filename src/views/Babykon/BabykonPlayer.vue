<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    player: Player,
    title: string,
    defaultValue?: number
}>()
defineEmits(['select-player', 'score-change']);

const valueList = [-2, -1, 0, 1, 2, 3, 4, 5];
const score = ref(props.defaultValue ?? 0);

function minusValue() {
    const index = valueList.indexOf(score.value) - 1;
    score.value = valueList[index <= 0 ? 0 : index];
}

function plusValue() {
    const index = valueList.indexOf(score.value) + 1;
    score.value = valueList[index >= valueList.length - 1 ? valueList.length - 1 : index];
}
</script>

<template>
    <div class="player-content" v-if="player?.id">
        <h3>{{ title }}</h3>
        <div class="player-informations">
            <img class="change-player-img" src="@/assets/images/sync-rotate.svg" width="25" height="25"
                @click="$emit('select-player', score)" />
            <img class="player-img" width="100" height="100"
                :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${player.firstName}${player.pseudo}${player.name}`"
                alt="Avatar" />
            <p class="player-full-name">{{ `${player.firstName} '${player.pseudo}' ${player.name}` }}</p>
        </div>
        <div class="player-score">
            <button class="action-btn" @click="minusValue(); $emit('score-change', score);">–</button>
            <select v-model="score" class="value-select" @change="$emit('score-change', score);">
                <option v-for="option in valueList" :value="option.valueOf()">{{ option }}</option>
            </select>
            <button class="action-btn" @click="plusValue(); $emit('score-change', score);">+</button>
        </div>
    </div>
    <div class="player-content-empty" v-else @click="$emit('select-player', score)">
        <span class="btn-select-player">Sélectionner {{ title }}</span>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.player-content,
.player-content-empty {
    width: 60vw;
    position: relative;
    padding: 10px;
    padding: 2em;
    background-color: rgb(184 251 249);
    box-shadow: 0px 0px 10px 2px rgba(137, 100, 100, 0.8);

    h3 {
        font-family: "Tilt Warp", sans-serif;
        font-size: 1.5rem;
        color: var(--text-color);
        margin: 0;
    }
}

.player-content-empty {
    border: .05em dashed;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .5em;
    animation-name: scale-animation;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
}

.btn-select-player {
    font-family: system-ui;
    font-style: normal;
    font-weight: bolder;
    font-size: 30px;
    top: -6px;
    position: relative;
    color: rgba(85, 67, 67, 0.8);
    text-align: center;
}

.player-informations {
    background-color: inherit;
    width: 100%;
    border-top-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.player-full-name {
    color: var(--text-color);
    margin: .5rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    text-align: center;
}

.player-score {
    display: flex;
    background-color: inherit;
    border-bottom-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    justify-content: center;
    width: 100%;
}

.value-select {
    text-align: center;
    font-family: "Sixtyfour Convergence", sans-serif;
    font-size: 2rem;
    border: none;
    appearance: none;
    padding-left: 10px;
    background-color: inherit;
}

.action-btn {
    font-size: 2em;
    font-weight: bolder;
    margin: 0.2em;
    appearance: none;
    border: none;
    background-color: inherit;
}

.alerts-border {
    border-radius: 5px;
    border-width: 4px;
    border-style: solid;
    border-image: linear-gradient(to right, red, purple);
    height: 40px;
    width: 40px;
}

@keyframes blink {
    50% {
        border-color: linear-gradient(to right, red, purple);
    }
}

.change-player-img {
    position: absolute;
    right: 10px;
    top: 10px;
}

.winner-icon {
    position: absolute;
    top: 2px;
    left: 2px;
}
</style>
