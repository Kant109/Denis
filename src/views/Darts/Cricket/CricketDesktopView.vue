<script setup lang="ts">
import { ref } from 'vue';
import CricketCardPlayer from '@/components/Cricket/CricketCardPlayer.vue';
import RadioSpeaker from '@/components/RadioSpeaker.vue';

const players = ref([{"id":2,"pseudo":"Mati","firstName":"Matis","name":"Charrier","isActive":true,"points":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0,"total":0},"doors":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0},"volleys":[["","",""]],"position":0},{"id":1,"pseudo":"Kant1","firstName":"Quentin","name":"ROULET","isActive":false,"points":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0,"total":0},"doors":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0},"volleys":[],"position":0},{"id":51,"pseudo":"Rom1F","firstName":"Romain","name":"Fontaine","isActive":false,"points":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0,"total":0},"doors":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0},"volleys":[],"position":0}]);

</script>

<template>
    <div class="desktop-view-container">

        <div class="players-container">
            <CricketCardPlayer
                v-for="player in players"
                :player="player"
                :is-active="player.isActive"
            />
        </div>

        <div class="commentary-container">
            <RadioSpeaker
                :is-always-enable="true"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>

.players-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

</style>