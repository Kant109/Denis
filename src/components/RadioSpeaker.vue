<script setup lang="ts">
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import { computed } from 'vue';

const managementAppStore = useManagementAppStore();

const displayRadioBox = computed(() => managementAppStore.displayRadioBox);

const stopSpeaker = () => {
    window.speechSynthesis.cancel();
    managementAppStore.displayRadioBox = false;
}

</script>

<template>
    <div class="radio-box-container" v-if="displayRadioBox">
        <div class="radio-box-content">
            <div class="radio-box-content-button" @click.prevent="stopSpeaker"><img src="@/assets/images/close-cross.svg" alt="Close"></div>
            <div class="radio-box-content-text">DENIS</div>
            <div class="radio-box-speak-animation">
                <div class="bar" v-for="index in 10"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.radio-box-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    padding: 0 1rem .5rem 1rem;
    border: 2px red solid;
    border-top: red 10px solid;
    position: absolute;
    right: 5%;
    top: 50%;
    border-radius: .5rem;
    z-index: 999;
    
    .radio-box-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        &-text {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            font-family: "Tilt Warp", sans-serif;
            font-size: 1.5rem;
            color: black;
        }

        &-button {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: -20%;
            right: -10%;
            background-color: white;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            border: 1px solid black;

            img {
                width: 1rem;
                height: 1rem;
                cursor: pointer;
            }
        }

        .radio-box-speak-animation {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 30px;

            .bar {
                background: red;
                bottom: 1px;
                height: 3px;
                width: 5px;
                margin: 0px 2px;
                border-radius: 5px;
                animation: sound 0ms -600ms linear infinite alternate;

                &:nth-child(1)  { left: 1px; animation-duration: 474ms; }
                &:nth-child(2)  { left: 15px; animation-duration: 433ms; }
                &:nth-child(3)  { left: 29px; animation-duration: 407ms; }
                &:nth-child(4)  { left: 43px; animation-duration: 458ms; }
                &:nth-child(5)  { left: 57px; animation-duration: 400ms; }
                &:nth-child(6)  { left: 71px; animation-duration: 427ms; }
                &:nth-child(7)  { left: 85px; animation-duration: 441ms; }
                &:nth-child(8)  { left: 99px; animation-duration: 419ms; }
                &:nth-child(9)  { left: 113px; animation-duration: 487ms; }
                &:nth-child(10) { left: 127px; animation-duration: 442ms; }
            }
        }
    }
}

@keyframes sound {
    0% {
       opacity: .5;
        height: 3px; 
    }
    100% {
        opacity: 1;       
        height: 30px;        
    }
}

</style>