<script setup lang="ts">
import PodiumPlayer from './podium-player.vue'

defineProps<{
  topTreePlayers: Array<PlayerRanking>;
}>();

</script>
<template>
  <div class="podium-players">    
      <podium-player class-name="podium-2" :player="topTreePlayers[1]" position="2"/>
      <podium-player class-name="podium-1" :player="topTreePlayers[0]" position="1"/>
      <podium-player class-name="podium-3" :player="topTreePlayers[2]" position="3"/>
  </div>
</template>

<style lang="scss" scoped>
.podium-players {
  display: flex;
  gap: 10px;
  min-height: 100px;
  height: 22vh;
}
</style>
