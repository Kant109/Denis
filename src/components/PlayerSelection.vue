<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import LoaderAnimation from "../assets/animations/loader.json";
import { usePlayerStore } from "@/stores/PlayerStore";
import { LottieAnimation } from "lottie-web-vue";
import { useManagementAppStore } from "@/stores/ManagementAppStore";

const props = defineProps<{
  sport: string
}>()

const playerStore = usePlayerStore();
const managementAppStore = useManagementAppStore();

const players = computed(() => playerStore.players);
// const selectedPlayers = ref([] as Array<Player>);
const openSearchPlayer = computed(() => managementAppStore.openPlayers);
const loader = ref(true);
const modalTitle = ref("Sélectionner des joueurs");
const creatingPlayer = ref(false);
const name = ref("");
const firstname = ref("");
const pseudo = ref("");
const formError = ref(false);

const closeModal = () => {
    managementAppStore.openPlayers = false;
}

const selectPlayer = (player: Player) => {
    const indexOfPlayer = players.value.indexOf(player);
    selectedPlayers.value.push(player);
    setTimeout(() => {
        players.value.splice(indexOfPlayer, 1);
    }, 400);
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

        selectedPlayers.value.push(player as Player);
    } catch (error: any) {
        console.error(error.message);
    }
}

const cancel = () => {
    creatingPlayer.value = false;
}

onMounted(async () => {
    let sportPlayer;
    switch(props.sport) {
        case 'dart':
            sportPlayer = 'orderedDartsPlayer';
            break;
        case 'babyfoot':
            sportPlayer = 'orderedBabyfootPlayer';
            break;
        default:
            sportPlayer = "";
            break;
    }
    if((localStorage.getItem(sportPlayer) as string) !== null) {
        const playersFromLocalStorage = JSON.parse(localStorage.getItem(sportPlayer) as string) as Array<Player>;
        selectedPlayers.value.push(...playersFromLocalStorage);
    }
    if(selectedPlayers.value.length < 1) {
        managementAppStore.openPlayers = true;
    }

    if(selectedPlayers.value.length > 0) {
        selectedPlayers.value.forEach(player => {
            players.value.forEach(playerFromApi => {
                if(player.id === playerFromApi.id) {
                    players.value.splice(players.value.indexOf(playerFromApi), 1);
                }
            })
        });
    }
    setTimeout(() => {
        loader.value = false;
    }, 1000);
})
</script>

<template>
    <Teleport to="main">
        <dialog class="search-player-dialog" :open="openSearchPlayer">
            <div class="loader" v-if="loader">
                <LottieAnimation 
                    :animation-data="LoaderAnimation"
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
                    <div v-for="player in players" :class="{'send-out': selectedPlayers.includes(player)}">  
                        <div class="select-player-container" v-if="players.includes(player)">
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
</style>