<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import { usePlayerStore } from '@/stores/PlayerStore';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import draggable from 'vuedraggable';
import { LottieAnimation } from "lottie-web-vue";
import DartsAnimation from "../../assets/animations/loader.json";

const router = useRouter();

const playersStore = usePlayerStore();

const allPlayers = ref([] as Array<Player>);
const selectedPlayers = ref([] as Array<Player>);
const deletedPlayers = ref([] as Array<Player>);
const openSearchPlayer = ref(false);
const modalTitle = ref("Sélectionner des joueurs");
const creatingPlayer = ref(false);
const formError = ref(false);
const messageErrorNbPlayer = ref(false);

const name = ref("");
const firstname = ref("");
const pseudo = ref("");
let drag = ref(false);
const loader = ref(true);


onMounted(async () => {
    if((localStorage.getItem('orderedDartsPlayer') as string) !== null) {
        const playersFromLocalStorage = JSON.parse(localStorage.getItem('orderedDartsPlayer') as string) as Array<Player>;
        selectedPlayers.value.push(...playersFromLocalStorage);
    }
    if(selectedPlayers.value.length < 1) {
        openSearchPlayer.value = true;
    }

    allPlayers.value = playersStore.players;

    if(selectedPlayers.value.length > 0) {
        selectedPlayers.value.forEach(player => {
            allPlayers.value.forEach(playerFromApi => {
                if(player.id === playerFromApi.id) {
                    allPlayers.value.splice(allPlayers.value.indexOf(playerFromApi), 1);
                }
            })
        });
    }
    setTimeout(() => {
        loader.value = false;
    }, 1000);
})

const addNewPlayer = async () => {
    openSearchPlayer.value = true;
    messageErrorNbPlayer.value = false;
}

const closeModal = () => {
    openSearchPlayer.value = false;
}

const selectPlayer = (player: Player) => {
    const indexOfPlayer = allPlayers.value.indexOf(player);
    selectedPlayers.value.push(player);
    setTimeout(() => {
        allPlayers.value.splice(indexOfPlayer, 1);
    }, 400);
}

const startGame = () => {
    if(selectedPlayers.value.length > 1) {
        router.push({ name: "darts-mode"});
        localStorage.setItem('orderedDartsPlayer', JSON.stringify([].slice.call(selectedPlayers.value)));
    } else {
        messageErrorNbPlayer.value = true;
    }
}

const addingPlayer = () => {
    modalTitle.value = "Nouveau joueur";
    creatingPlayer.value = true;
}

const createPlayer = async () => {
    if (firstname.value.length < 1 && name.value.length < 1 && pseudo.value.length < 1) {
        formError.value = true;
        return;
    }

    modalTitle.value = "Sélectionner des joueurs";
    creatingPlayer.value = false;
    formError.value = false;
    
    let player = {
        "firstName": firstname.value,
        "name": name.value,
        "pseudo": pseudo.value
    }

    firstname.value = "";
    name.value = "";
    pseudo.value = "";
    
    try {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/players", {
            method: "POST",
            body: JSON.stringify(player),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        Object.assign(player, { id: await response.json() });
        Object.assign(player, { order: (selectedPlayers.value.length + 1).toString() });

        selectedPlayers.value.push(player as Player);
    } catch (error: any) {
        console.error(error.message);
    }
}

const cancel = () => {
    creatingPlayer.value = false;
}

const back = () => {
    router.push({ name: "home" });
}

watch(
    () => deletedPlayers.value,
    () => {
        allPlayers.value.push(deletedPlayers.value[0]);
        deletedPlayers.value.pop();
    }
)
</script>

<template>
    <div class="settings-container" :class="{'blur': openSearchPlayer}">
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
    <Teleport to="main">
        <dialog class="search-player-dialog" :open="openSearchPlayer">
            <div class="loader" v-if="loader">
                <LottieAnimation 
                    :animation-data="DartsAnimation"
                    :auto-play="true"
                    :loop="true"
                    :speed="1"
                    ref="anim"
                />
            </div>
            <div class="content" v-else>
                <div class="dialog-title">{{ modalTitle }}</div>
                <div class="search-player" v-if="!creatingPlayer">
                    <div class="btn-create-modal" @click.prevent="addingPlayer">Créer un joueur</div>
                    <div v-for="player in allPlayers" :class="{'send-out': selectedPlayers.includes(player)}">  
                        <div class="select-player-container" v-if="allPlayers.includes(player)">
                            <img class="player-img" :src="'https://api.dicebear.com/9.x/adventurer/svg?seed=' + player.firstName + player.pseudo + player.name" alt="Avatar" />
                            <div class="player-name">
                                <div class="player-name-pseudo">{{ player.pseudo.length > 18 ? player.pseudo.substring(0,18) + ".." : player.pseudo}}</div>
                                <div class="player-full-name">{{ player.firstName.length + player.name.length > 18 ? (player.firstName + " " + player.name).substring(0,18) + ".." : player.firstName + " " + player.name}}</div>
                            </div>
                        </div>
                        <div class="select-player" @click.prevent="selectPlayer(player)"></div>
                    </div>
                    <div class="btn-close-modal" @click.prevent="closeModal">Valider</div>
                </div>
                <div class="create-player" v-if="creatingPlayer">
                    <div class="input" :class="{'error': formError}">
                        <label for="firstname">Prénom</label>
                        <input type="text" id="firstname" name="firstname" minlength="2" required v-model="firstname" />
                        <span>Votre nom doit contenir au moins 2 caractères</span>
                    </div>
                    
                    <div class="input" :class="{'error': formError}">
                        <label for="name">Nom</label>
                        <input type="text" id="name" name="name" minlength="2" required v-model="name" />
                        <span>Votre prénom doit contenir au moins 2 caractères</span>
                    </div>
                    
                    <div class="input" :class="{'error': formError}">
                        <label for="name">Pseudo</label>
                        <input type="text" id="name" name="name" required minlength="2" v-model="pseudo" />
                        <span>Votre pseudo doit contenir au moins 2 caractères</span>
                    </div>

                    <div class="btn-save-player-modal" @click.prevent="createPlayer">Créer le joueur</div>
                    <div class="btn-cancel-modal" @click.prevent="cancel">Annuler</div>
                </div>
            </div>
        </dialog>
    </Teleport>
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