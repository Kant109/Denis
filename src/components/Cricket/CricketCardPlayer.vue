<script setup lang="ts">

const props = defineProps<{
  player: CricketPlayer
  isActive: boolean
}>()

</script>

<template>
    <div class="player-container">
        <div class="player-content" :class="{'isPlayerActive': player.isActive }">
            <div class="player-name">{{ player.pseudo.length > 5 ? player.pseudo.substring(0,5) + ".." : player.pseudo}}</div>
            <div class="recap">
                <div class="doors">
                    <div class="door" :class="{'first': player.doors[15] !== 0, 'second': player.doors[15] >= 2, 'full': player.doors[15] >= 3}"></div>
                    <div class="door" :class="{'first': player.doors[16] !== 0, 'second': player.doors[16] >= 2, 'full': player.doors[16] >= 3}"></div>
                    <div class="door" :class="{'first': player.doors[17] !== 0, 'second': player.doors[17] >= 2, 'full': player.doors[17] >= 3}"></div>
                    <div class="door" :class="{'first': player.doors[18] !== 0, 'second': player.doors[18] >= 2, 'full': player.doors[18] >= 3}"></div>
                    <div class="door" :class="{'first': player.doors[19] !== 0, 'second': player.doors[19] >= 2, 'full': player.doors[19] >= 3}"></div>
                    <div class="door" :class="{'first': player.doors[20] !== 0, 'second': player.doors[20] >= 2, 'full': player.doors[20] >= 3}"></div>
                    <div class="door" :class="{'first': player.doors[25] !== 0, 'second': player.doors[25] >= 2, 'full': player.doors[25] >= 3}"></div>
                </div>
            </div>
            <div class="points-taken">{{ player.points.total }}</div>
        </div>
        <div class="player-stats" :class="{'isPlayerActive': player.isActive}">
            <div class="recap-doors">
                <div class="recap-door">15</div>
                <div class="recap-door">16</div>
                <div class="recap-door">17</div>
                <div class="recap-door">18</div>
                <div class="recap-door">19</div>
                <div class="recap-door">20</div>
                <div class="recap-door">25</div>
            </div>
            <div class="current-points">
                <div class="points">{{ player.volleys.length > 0 ? player.volleys[player.volleys.length - 1][0] : "" }}</div>
                <div class="points">{{ player.volleys.length > 0 ? player.volleys[player.volleys.length - 1][1] : "" }}</div>
                <div class="points">{{ player.volleys.length > 0 ? player.volleys[player.volleys.length - 1][2] : "" }}</div>
            </div>
            <div class="points-recap" :class="{'isPlayerActive': player.isActive}">
                <div class="doors">
                    <div class="door"><div class="base">15</div><div class="taken">{{ player.points[15] }}</div></div>
                    <div class="door"><div class="base">16</div><div class="taken">{{ player.points[16] }}</div></div>
                    <div class="door"><div class="base">17</div><div class="taken">{{ player.points[17] }}</div></div>
                    <div class="door"><div class="base">18</div><div class="taken">{{ player.points[18] }}</div></div>
                    <div class="door"><div class="base">19</div><div class="taken">{{ player.points[19] }}</div></div>
                    <div class="door"><div class="base">20</div><div class="taken">{{ player.points[20] }}</div></div>
                    <div class="door"><div class="base">25</div><div class="taken">{{ player.points[25] }}</div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.player-container {
    border-bottom: 1px solid rgba(0, 0, 0, .25);
    border-radius: 1rem;

    .player-content {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        height: 60px;
        background-color: var(--bg-color-secondary);
        border-radius: 1rem 1rem 0 0;
        padding: 0 1rem;
        --tw-shadow: inset 0 5px 0 0 rgba(0, 0, 0, .25);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        cursor: pointer;

        .player-name, .points-taken {
            display: flex;
            align-items: center;
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;
            color: var(--text-color);

            &:is(.player-name) {
                min-width: 55px;
                grid-area: 1 / 1 / 2 / 2;
            }

            &:is(.points-taken) {
                justify-content: flex-end;
                grid-area: 1 / 5 / 2 / 6;
            }
        }

        .recap {
            display: flex;
            justify-content: center;
            flex-direction: column;
            grid-area: 1 / 2 / 2 / 5;
            gap: .5rem;
            padding-top: 5px;

            .doors {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: .5rem;
                
                .door {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid var(--cricket-door-disable);
                    border-radius: 50%;
                    height: 1.5rem;
                    width: 1.5rem;
                    position: relative;

                    &::before, &::after {
                        content: '';
                        position: absolute;
                        width: 100%;
                        background-color: var(--cricket-door-disable);
                        height: 2px;
                    }

                    &::before {
                        transform: rotate(45deg);
                    }
                    &::after {
                        transform: rotate(-45deg);
                    }

                    &.first {
                        &::after {
                            background-color: var(--cricket-door-confirm) !important;
                        }
                    }
                    &.second {
                        &::before {
                            background-color: var(--cricket-door-confirm) !important;
                        }
                    }
                    &.full {
                        border: 2px solid var(--cricket-door-confirm) !important;
                    }
                }
            }
        }

        &.isPlayerActive {
            background-color: var(--active-player);

            .player-name, .points-taken {
                color: #121212;
            }

            .recap {
                .doors {
                    .door {
                        border: 2px solid rgba(0, 0, 0, 0.1);

                        &::before, &::after {
                            background-color: rgba(0, 0, 0, 0.1);
                        }
                    }
                }
            }
        }
    }

    .player-stats {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        background-color: var(--bg-color-secondary);
        border-radius: 0 0 1rem 1rem;

        &.isPlayerActive {
            background-color: var(--active-player);
        }

        .recap-doors {
            display: flex;
            gap: .5rem;
            font-family: "Tilt Warp", sans-serif;
            font-size: 1rem;

            .recap-door {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
                background-color: white;
                width: 1.5rem;
                aspect-ratio: 1/1;
                border: 1px solid rgba(0, 0, 0, .25);
            }
        }

        .current-points {
            display: flex;
            justify-content: center;
            gap: 2rem;

            .points {
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: "Tilt Warp", sans-serif;
                font-size: 1rem;
                padding-bottom: 5px;
                border-radius: 8px;
                width: 2.5rem;
                aspect-ratio: 1/1;
                background-color: white;
                border: 1px solid rgba(0, 0, 0, .25);
                --tw-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, .25);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            }
        }

        .points-recap {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;

            .doors {
                display: flex;
                gap: .5rem;
                font-family: "Tilt Warp", sans-serif;
                font-size: 1rem;

                .door {
                    border-radius: 5px;
                    border: 1px solid rgba(0, 0, 0, .25);

                    .base, .taken {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 2rem;
                        border-radius: 5px;
                        aspect-ratio: 1/1;
                        
                        &:is(.base) {
                            border-bottom: none;
                            padding-bottom: 5px;
                            background-color: white;
                            --tw-shadow: inset 0 -5px 0 0 rgba(0, 0, 0, .25);
                            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                        }

                        &:is(.taken) {
                            color: var(--text-color);
                        }
                    }
                }
            }

            &.isPlayerActive {
                background-color: var(--active-player);

                .doors {
                    .door {
                        .taken {
                            color: #121212;
                        }
                    }
                }
            }
        }
    }
}
</style>