<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementAppStore } from '@/stores/ManagementAppStore';
import GameContainer from '@/components/GameContainer.vue';

const managementAppStore = useManagementAppStore();

const router = useRouter();

const isAnimationLaunch = ref(false);
const launchJelloAnimation = ref(false);
const animationImg = ref('');

const isDarkMode = computed(() => managementAppStore.isDarkMode);

const goToProfile = () => {
    router.push({ name: "profile"});
}

const setDarkMode = () => {
    managementAppStore.isDarkMode = !isDarkMode.value;
    localStorage.setItem('darkmode-apsidart', managementAppStore.isDarkMode ? 'active' : 'disable');
}

const launchAnimation = (img: string) => {
    animationImg.value = img;
    isAnimationLaunch.value = true;
    setTimeout(() => {
        launchJelloAnimation.value = true;
    }, 200);
}

const getRanking = () => {
    launchAnimation('trophy_3d');
    setTimeout(() => {
        router.push({ name: "ranking"});
    }, 1100);
}

const getDart = () => {
    launchAnimation('dart');
    setTimeout(() => {
        router.push({ name: "darts-player"});
    }, 1100);
}


const getBabykon = () => {
    launchAnimation('babyfoot');
    setTimeout(() => {
        router.push({ name: "babykon-game"});
    }, 1100);
}

const getGameDetails = () => {
    launchAnimation('crossed_swords_3d');
    setTimeout(() => {
        router.push({ name: "game-details"});
    }, 1100);
}

</script>

<template>
    <div class="header" :class="{'isAnimationLaunch': isAnimationLaunch}">
        <!-- <div class="profile" @click.prevent="goToProfile"></div> -->
        <h1 class="title">ENIS</h1>
        <!-- <div class="dark-mode" @click.prevent="setDarkMode">
            <input id="toggle" class="toggle" :class="{'darkmode': isDarkMode}" type="checkbox">
        </div> -->
    </div>
    <div class="details-container" :class="{'isAnimationLaunch': isAnimationLaunch}">
        <h2>Général :</h2>
        <div class="ranking-btn" @click.prevent="getRanking()">
            <img src="@/assets/images/trophy_3d.png" alt="Trophée">
            <div class="content">Classement</div>
        </div>
        <!-- <div class="games-btn" @click.prevent="getGameDetails()">
            <img src="@/assets/images/crossed_swords_3d.png" alt="Trophée">
            <div class="content">Parties</div>
        </div> -->
    </div>
    <div class="all-games-container" :class="{'isAnimationLaunch': isAnimationLaunch}">
        <h2>Jeux :</h2>
        <GameContainer
            img="dart"
            title="Fléchettes"
            route-name="darts-player"
            @click.prevent="getDart()"
        />
        <GameContainer
            img="babyfoot"
            title="Babykon"
            route-name="babykon-game"
            @click.prevent="getBabykon()"
        /> 
    </div>
    <div v-if="isAnimationLaunch" class="container-animation">
        <div class="scale-animation" :class="{'jello-animation': launchJelloAnimation}">
            <img :src="'/icons/' + animationImg + '.png'" alt="Image Game">
        </div>
    </div>
</template>

<style lang="scss" scoped>

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem 1rem;
    background-color: var(--bg-color-primary);

    .profile {
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        background-color: white;
        cursor: pointer;
    }

    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "Honk", system-ui;
        font-size: 2rem;
        color: var(--text-color);
        margin: 0;

        &::before {
            content: "";
            width: 4rem;
            height: 4rem;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url("@/assets/images/logo.svg");
            box-sizing: border-box;
            margin-right: -.8rem;
        }
    }

    .dark-mode {
        .toggle {
            --size: 2rem;
            
            appearance: none;
            outline: none;
            cursor: pointer;
            
            width: var(--size);
            height: var(--size);
            
            --ray-size: calc(var(--size) * -0.4);
            --offset-orthogonal: calc(var(--size) * 0.65);
            --offset-diagonal: calc(var(--size) * 0.45);

            color: hsl(40, 100%, 50%);
            border-radius: 999px;
            box-shadow: 
            inset 0 0 0 var(--size),
            calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size),
            var(--offset-orthogonal) 0 0 var(--ray-size),
            0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size),
            0 var(--offset-orthogonal) 0 var(--ray-size),
            calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size),
            var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size),
            calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size),
            var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size),
            ;
            
            transition: all 500ms;
            
            &.darkmode {
                transform: scale(1.35);

                box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
                color: hsl(240, 100%, 95%);
            }
        }
    }

    &.isAnimationLaunch {
        opacity: 0;
        animation-duration: .2s;
        animation-name: disapear;
    }
}

.details-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 0rem 0.5rem 1rem 0.5rem;

    .ranking-btn, .games-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        width: 100%;
        height: 3rem;
        position: relative;
        background-color: var(--bg-color-secondary);
        border-radius: 8px;
        cursor: pointer;

        img {
            width: 2rem;
            height: 2rem;
        }
        
        .content {
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;
            color: var(--text-color);
        }
    }

    &.isAnimationLaunch {
        opacity: 0;
        animation-duration: .2s;
        animation-name: disapear;
    }
}

.all-games-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 0 .5rem;

    &.isAnimationLaunch {
        opacity: 0;
        animation-duration: .2s;
        animation-name: disappear;
    }
}

.container-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 9rem;
    height: 9rem;

    display: flex;
    align-items: center;
    justify-content: center;

    .scale-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-color-secondary);
        border-radius: .5rem;
        animation: scale-up-center .2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        
        img {
            width: 9rem;
            height: 9rem;
        }

        &.jello-animation {
            animation: jello-horizontal 0.9s both;
        }
    }
}

@keyframes scale-up-center {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes jello-horizontal {
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

@keyframes disappear {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

</style>