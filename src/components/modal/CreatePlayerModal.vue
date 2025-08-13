<script setup lang="ts">
import { LottieAnimation } from "lottie-web-vue";
import LoaderAnimation from "@/assets/animations/loader.json";
import { ref } from "vue";

const props = defineProps<{
  openModal: boolean;
  title: string;
}>();
const emit = defineEmits(["close-modal", "create-player"]);

const MINIMAL_STRING_VALUE_LENGTH = 2;
const formError = ref(false);
const firstname = ref('');
const lastname = ref('');
const pseudo = ref('');

const formIsValid = () => {
    if(firstname.value.trim() === '' || lastname.value.trim() === '' || pseudo.value.trim() === '') {
        return false;
    }
    return true;
}

const createPlayer = async () => {
    if (!formIsValid()) {
        formError.value = true;
        return;
    }
    formError.value = false;
    
    let player = {
        "firstName": firstname.value,
        "name": lastname.value,
        "pseudo": pseudo.value
    }

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

        emit('create-player', player);
    } catch (error: any) {
        console.error(error.message);
    }
}
</script>
<template>
  <dialog id="create-player-dialog" class="dialog" :open="openModal">
    <div class="dialog-content">
      <div class="dialog-header dialog-header--sticky">
        <h3 class="dialog-title">{{ title }}</h3>
        <span class="dialog-close" @click.prevent="emit('close-modal')">x</span>
      </div>
      <div class="dialog-body">
        <div class="create-player-container">
            <div class="input">
                <label for="firstname">Prénom</label>
                <input type="text" id="firstname" name="firstname" minlength="2" required v-model="firstname" />
                <span v-if="formError && firstname.length > 0 && firstname.trim().length < MINIMAL_STRING_VALUE_LENGTH">Votre nom doit contenir au moins 2 caractères</span>
            </div>
            
            <div class="input">
                <label for="name">Nom</label>
                <input type="text" id="name" name="name" minlength="2" required v-model="lastname" />
                <span v-if="formError && lastname.length > 0 && lastname.trim().length < MINIMAL_STRING_VALUE_LENGTH">Votre prénom doit contenir au moins 2 caractères</span>
            </div>
            
            <div class="input">
                <label for="name">Pseudo</label>
                <input type="text" id="name" name="name" required minlength="2" v-model="pseudo" />
                <span v-if="formError && pseudo.length > 0 && pseudo.trim().length < MINIMAL_STRING_VALUE_LENGTH">Votre pseudo doit contenir au moins 2 caractères</span>
            </div>

            <div>
                <h4>Image générée : </h4>
                <LottieAnimation v-show="!formIsValid()" class="animation" :animation-data="LoaderAnimation" :auto-play="true" :loop="true"
                    :speed="0.8" ref="anim" />
                <img v-if="formIsValid()" height="200"
                class="player-img"
                :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${firstname}${pseudo}${lastname}`"
                alt="Avatar"
              />
            </div>
        </div>
      </div>
      <div class="dialog-footer">
            <button @click.prevent="createPlayer">Créer le joueur</button>
            <button @click.prevent="emit('close-modal')">Annuler</button>
      </div>
    </div>
  </dialog>
</template>
<style lang="scss" scoped>
  @use "../../assets/helpers/dialog.scss";

.create-player-container {
    max-height: 80vh;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 16px;

    .input {
        display: flex;
        flex-direction: column;

        span {
            display: inline-block;
            color: red;
        }
    }
}
.dialog-body {
  margin-bottom: 0;
}

.dialog-footer {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    min-height: 20%;
    margin: 16px 0;
    position: fixed;
    bottom: 0;
    width: 100%;

    button {
      --tw-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, .25);
      box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
      border: 1px solid rgba(0, 0, 0, .25);
      background-color: var(--bg-color-secondary);
      min-height: 60px;
      width: 50%;
      border-radius: 1rem;
      margin: 0 2rem;
      font-size: 1.5rem;
      color: var(--text-color);
      padding-bottom: 5px;

        &:active {
          color: rgba(black, .25);
          transform: translateY(5px);
          box-shadow: none;
      }

      &:hover {
          cursor: pointer;
      }
    }
}
</style>
