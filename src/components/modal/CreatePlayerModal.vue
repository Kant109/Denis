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
        "firstname": firstname.value,
        "name": lastname.value,
        "pseudo": pseudo.value
    }

    try {
        const response = await fetch(import.meta.env.VITE_BE_URL + "/player", {
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
                <div class="dialog-footer">
                    <button @click.prevent="createPlayer">Créer le joueur</button>
                    <button @click.prevent="emit('close-modal')">Annuler</button>
                </div>
            </div>
        </div>
    </dialog>
</template>

<style lang="scss" scoped>
@import "@/assets/helpers/mixins.scss";

.dialog {
    inset-block-start: 0px;
    inset-block-end: 0px;
    width: 100%;
    user-select: text;
    visibility: visible;
    border: none;
    padding: 0;
    border-radius: 0.5rem;

    .dialog-header {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: canvas;
        padding: 16px;
        border-radius: 0.5rem;
        min-height: 20%;
    
        .dialog-title {
            font-size: 1.5rem;
            color: var(--text-color);
            margin: 0;
        }
    
        .dialog-close {
            padding: 0.5em;
            position: absolute;
            right: 0;
            top: 12px;
            font-size: 1rem;
        }
    }

    .dialog-body {
        overflow-y: auto;
        border-radius: 0.5rem;
        margin-bottom: 10px;

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
        .dialog-footer {
            display: flex;
            gap: 1rem;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            margin: 0 1rem;
        
            button {
                @include btn-primary;
            }
        }
    }
}

</style>
