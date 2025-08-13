<script setup lang="ts">
import { usePlayerStore } from "@/stores/PlayerStore";
import { onMounted, ref, watch } from "vue";
import { getPlayerLibelle, getPlayerFullName } from "../../common/PlayerUtil";
import CreatePlayerModal from "./CreatePlayerModal.vue";

const props = defineProps<{
  openModal: boolean;
  title: string;
  unselectablePlayerIds: number[];
}>();
defineEmits(["close-modal", "select-player"]);

onMounted(async () => {
  allPlayers.value = playersStore.players;
});

const playersStore = usePlayerStore();
const allPlayers = ref([] as Array<Player>);
const searchText = ref('');
const openCreatePlayer = ref(false);

</script>
<template>
  <dialog id="search-player-dialog" class="dialog" :open="openModal">
    <div class="dialog-content">
      <div class="dialog-header dialog-header--sticky">
        <h3 class="dialog-title">{{ title }}</h3>
        <span class="dialog-close" @click.prevent="searchText='';$emit('close-modal')">x</span>
      </div>
      <div class="dialog-body">
          <div class="search-player-container">
            <input v-model="searchText"></input>
            <button @click="() => openCreatePlayer = true">+</button>
          </div>
          <div class="select-player-container">
            <div
              class="select-player d-flex"
              v-for="player in allPlayers.filter(
                (p) => !unselectablePlayerIds.find((id) => p.id === id) && getPlayerLibelle(p).toLocaleLowerCase().includes(searchText)
              )"
              @click.prevent="$emit('select-player', player)"
            >
              <img
                class="player-img"
                :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${getPlayerLibelle(
                  player
                )}`"
                alt="Avatar"
              />
              <div class="player-name d-flex">
                <span class="player-name-pseudo"> {{ player.pseudo }} </span>
                <span class="player-full-name">
                  {{ getPlayerFullName(player) }}</span
                >
              </div>
            </div>
        </div>
      </div>
    </div>
  </dialog>
  <Teleport to="main">
    <CreatePlayerModal v-if="openCreatePlayer" :open-modal="openCreatePlayer" title="Créer un nouveau joueur" @close-modal="openCreatePlayer=false" 
      @create-player="(player: Player) => {allPlayers.push(player);openCreatePlayer=false}"></CreatePlayerModal>
  </Teleport>
</template>
<style lang="scss" scoped>
  @use "../../assets/helpers/dialog.scss";

.select-player-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  justify-content: space-between;
  margin: 0 16px;
  max-height: 80vh;
  height: 100%;

  .select-player {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: var(--bg-color-primary);
    border: 5px solid var(--bg-color-primary);
    border-radius: 0.5rem;
    font-size: 0.8rem;
    min-width: 150px;
    height: fit-content;

    .player-img {
      height: 3rem;
      width: 3rem;
      border-radius: 50%;
      background-color: white;
      cursor: pointer;
    }

    .player-name {
      flex-direction: column;

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        max-width: 6em;
      }
    }
  }
}
.search-player-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
</style>
