<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import draggable from 'vuedraggable';
import { usePlayerStore } from '@/stores/PlayerStore';
import PlayerSelection from '@/components/PlayerSelection.vue';

const router = useRouter();

const managementAppStore = useManagementAppStore();
const playerStore = usePlayerStore();

const players = computed(() => playerStore.players);
const selectedPlayers = ref([] as Array<Player>);
const deletedPlayers = ref([] as Array<Player>);
const blur = computed(() => managementAppStore.openPlayers);
const messageErrorNbPlayer = ref(false);

let drag = ref(false);

const addNewPlayer = async () => {
    managementAppStore.openPlayers = true;
    messageErrorNbPlayer.value = false;
}

const startGame = () => {
    if(selectedPlayers.value.length > 1) {
        router.push({ name: "darts-mode"});
        localStorage.setItem('orderedDartsPlayer', JSON.stringify([].slice.call(selectedPlayers.value)));
    } else {
        messageErrorNbPlayer.value = true;
    }
}

const back = () => {
    router.push({ name: "home" });
}

watch(
    () => deletedPlayers.value,
    () => {
        players.value.push(deletedPlayers.value[0]);
        deletedPlayers.value.pop();
    }
)
</script>

<template>
    <div class="settings-container" :class="{'blur': blur}">
        <Header title="FLÉCHETTES" @previous-route="back" />
        <div class="adding-player-container">
            <draggable 
                tag="div"
                v-model="selectedPlayers"
                animation="200"
                group="players"
                @start="drag = true"
                @end="drag = false"
                ghost-class = "ghost"
                class="adding-player-recap"
                item-key="order"
            >
                <template #item="{ element: player }: {element : Player}" @dragover.prevent>
                    <div class="player-container">
                        <i class="player-order">{{ selectedPlayers.indexOf(player) + 1  }}</i>
                        <div class="player-content" @dragstart.prevent>
                            <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstName + player.pseudo + player.name" alt="Avatar" />
                            <div class="player-name">{{ player.pseudo.length > 5 ? player.pseudo.substring(0,5) + ".." : player.pseudo}}</div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="btn-container-add" @click.prevent="addNewPlayer">
                        <i class="btn-add-player">+</i>
                    </div>
                </template>
            </draggable>
            <div class="error-nb-player" v-if="messageErrorNbPlayer">Il faut minimum 2 joueurs pour lancer une partie</div>
            <draggable
                v-if="drag"
                class="delete-player"
                animation="200"
                v-model="deletedPlayers"
                group="players"
                item-key="order"
            >
                <template #item="{ element: player }: {element : Player}"></template>
            </draggable>
            <div class="btn-container">
                <div class="btn-start-game" @click.prevent="startGame">Choix du mode</div>
            </div>
        </div>
    </div>
    <PlayerSelection
        sport="dart"
    />
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.settings-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: scroll;
    padding-bottom: 2rem;

    &.blur {
        filter: blur(10px);
    }

    .adding-player-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 1rem;
        animation: appear .5s;

        .adding-player-recap, .delete-player {

            &:is(.adding-player-recap) {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: auto;
                grid-column-gap: 1rem;
                grid-row-gap: 1rem;
                background-color: var(--bg-color-secondary);
                border-radius: .5rem;
                width: 90%;
                padding: 1rem;
                box-shadow: rgb(0, 0, 0, .25) 0px 5px 5px 0px inset;
            }

            .player-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: var(--bg-color-primary);
                width: min( 102px, 100%);

                border: 5px solid var(--bg-color-primary);
                border-radius: .5rem;
                position: relative;

                &.ghost {
                    opacity: .5rem;
                }

                &:hover {
                    cursor: grab;
                }

                .player-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: .5rem;
                    padding: .5rem 0;

                    .player-img {
                        height: 3rem;
                        width: 3rem;
                        border-radius: 50%;
                        background-color: white;
                        cursor: pointer;
                    }


                    .player-name {
                        font-family: "Tilt Warp", sans-serif;
                        font-size: 1rem;
                        color: var(--text-color);
                    }
                }
                .player-order {
                    font-family: "Tilt Warp", sans-serif;
                    position: absolute;
                    top: 0.1rem;
                    left: 0.2rem;
                    font-style: normal;
                    font-size: large;
                }
            }

            &:is(.delete-player) {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(red, .25);
                background-image: url("@/assets/images/trash.svg");
                background-position: center;
                background-size: 50px;
                background-repeat: no-repeat;
                border-radius: .5rem;
                width: 25%;
                height: 75px;
                
                .player-container {
                    opacity: 50%;
                }
            }
        }

        .error-nb-player {
            font-family: "Tilt Warp", sans-serif;
            font-size: .75rem;
            color: red;
        }

        .btn-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 80%;
            gap: 1rem;
            
            .btn-start-game, .btn-save-players {
                @include btn-primary;
            }
            
            .btn-add-player, .btn-modif-player, .btn-change-order {
                @include btn-secondary;
            }
        }
    }
}

.btn-container-add {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .5rem;
    border: 4px dotted var(--bg-color-primary);
    background-color: #ffecd140;
    min-height: 102px;
}

.btn-add-player {
    font-family: system-ui;
    font-style: normal;
    font-weight: bolder;
    font-size: 50px;
    top: -6px;
    position: relative;
    color: var(--active-player);
}

.btn-remove {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: white;
    width: 26px;
    height: 26px;
    min-height: 26px;
    border-radius: 16px;
    display: flex;
    box-shadow: 1px 2px 1px 1px rgb(39 39 81 / 33%);
    border: 1px solid rgba(0, 0, 0, .25);
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover {
        cursor: pointer;
    }

    .btn-remove-icon {
        font-family: system-ui;
        font-size: 18px;
        font-style: normal;
        font-weight: bolder;
        top: -2px;
        position: relative;
        color:red;
    }
}

@keyframes appear {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes bounce-border-color {
    0%, 100% {
        border-color: rgba(red, .25);
    }
    50% {
        border-color: red;
    }
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
</style>