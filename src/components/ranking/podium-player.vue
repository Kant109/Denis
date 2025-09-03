<script setup lang="ts">
import { getPlayerRankingLibelle, winrate } from "@/common/PlayerUtil";
import { ref } from "vue";

defineProps<{
    player: PlayerRanking;
    position: String;
    className?: String;
}>();

const isCheckStats = ref(false);

const baseUrl = import.meta.env.VITE_DICEBEAR_SVG_URL;
</script>
<template>
        <div class="podium" :class="className" @click.prevent="isCheckStats = !isCheckStats">
            <div class="podium-player">
                <img height="80" class="player-img" :src="`${baseUrl}${getPlayerRankingLibelle(player)}`"
                    alt="Avatar" />
                <span class="podium-player-name">{{
                    `${player.name} ${player.lastName[0]}`
                    }}</span>
            </div>
            <div class="podium-standing" :class="isCheckStats ? 'flip' : ''">
                <span :class="{ invisible: isCheckStats}" class="podium-position">{{ position }}</span>
                <span :class="{ invisible: isCheckStats}" class="podium-player-elo">{{ player.elo }}</span>
                <span :class="{ visible: isCheckStats}" class="podium-number-game">{{ `🏆 ${winrate(player.nbGame, player.nbVictory)} %` }}</span>
                <span :class="{ visible: isCheckStats}" class="podium-winrate">{{ `${player.nbGame} parties` }}</span>
            </div>
        </div>
</template>

<style lang="css" scoped>
.podium-container {
    display: block;
}

.podium {
    display: flex;
    flex-direction: column;
    flex-flow: column;
    justify-content: flex-end;
}

.podium-player {
    flex: 0 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        transform: translateY(15px);
    }
}

.podium-position,
.podium-player-elo {
    text-align: center;
    backface-visibility: hidden;
    transition: visibility;
    transition-delay: 250ms;
}

.podium-number-game,
.podium-winrate {
    visibility: hidden;
    transition: visibility;
    transition-delay: 250ms;
}
.podium-position.invisible, .podium-player-elo.invisible {
    visibility: hidden;
}
.podium-number-game.visible, .podium-winrate.visible {
    visibility: visible;
}

.podium-number-game, .podium-winrate {
    transform: rotateY(180deg);
}
.podium-position {
    position: absolute;
    bottom: 25px;
}

.podium-player-elo {
    position: absolute;
    bottom: 5px;
    background-color: white;
    border-radius: 12px;
    padding: 0 .5em;
}

.podium-standing {
    --tw-shadow: inset 18px 0 0 0 rgba(0, 0, 0, 0.1);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
        var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border-radius: 18px;
    border-bottom-left-radius: 10px;
    background-color: white;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: transform 0.8s;
}

.podium-position {
    color: white;
    font-size: 2em;
    font-weight: 500;
}

.podium-1 {
    .podium-standing {
        min-height: 60%;
        background-color: #ffd782;
    }
} 

.podium-2 {
    .podium-standing {
        min-height: 50%;
        background-color: #ff6464;
    }
} 

.podium-3 {
    .podium-standing {
        min-height: 45%;
        background-color: #18bdf6;
    }
}
.flip {
  transform: rotateY(180deg);
}
</style>
