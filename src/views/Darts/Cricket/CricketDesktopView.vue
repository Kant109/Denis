<script setup lang="ts">
import { ref } from 'vue';
import CricketCardPlayer from '@/components/Cricket/CricketCardPlayer.vue';
import RadioSpeaker from '@/components/RadioSpeaker.vue';

const players = ref([{"id":2,"pseudo":"Mati","firstName":"Matis","name":"Charrier","isActive":true,"points":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0,"total":0},"doors":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0},"volleys":[["","",""]],"position":0},{"id":1,"pseudo":"Kant1","firstName":"Quentin","name":"ROULET","isActive":false,"points":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0,"total":0},"doors":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0},"volleys":[],"position":0},{"id":51,"pseudo":"Rom1F","firstName":"Romain","name":"Fontaine","isActive":false,"points":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0,"total":0},"doors":{"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"25":0},"volleys":[],"position":0}]);

const simple20 = ref('#fff');
const triple20 = ref('#fff');
const double20 = ref('#fff');

const simple19 = ref('#fff');
const triple19 = ref('#fff');
const double19 = ref('#fff');

const simple18 = ref('#fff');
const triple18 = ref('#fff');
const double18 = ref('#fff');

const simple17 = ref('#fff');
const triple17 = ref('#fff');
const double17 = ref('#fff');

const simple16 = ref('#fff');
const triple16 = ref('#fff');
const double16 = ref('#fff');

const simple15 = ref('#fff');
const triple15 = ref('#fff');
const double15 = ref('#fff');

const bull = ref('#fff');
const doubleBull = ref('#fff');



</script>

<template>
    <div class="desktop-view-container">

        <div class="players-container">
            <CricketCardPlayer
                v-for="player in players"
                :player="player"
                :is-active="player.isActive"
            />
        </div>

        <div class="dartboard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">

                <circle cx="300" cy="300" r="250" stroke="black" stroke-width="100"/>

                <!-- Création des 20 secteurs -->
                <g>
                    <!-- 20 --> <path d="M300,300 L339,53 A300,300 0 0 0 261,53 Z" :fill="simple20"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M336,74 L339,53 A300,300 0 0 0 261,53 L264,74 A300,300 0 0 1 336,74 Z" :fill="double20"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M321,169 L324,149 A300,300 0 0 0 276,149 L279,169 A300,300 0 0 1 321,169 Z" :fill="triple20"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(562, 215) rotate(72)">13</text>

                    <!-- 5 --> <path d="M300,300 L261,53 A300,300 0 0 0 187,77 Z" fill="#EFDEAD"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M264,74 L261,53 A300,300 0 0 0 187,77 L196,96 A300,300 0 0 1 264,74 Z" fill="#3E7A31"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M279,169 L276,149 A300,300 0 0 0 230,164 L240,182 A300,300 0 0 1 279,169 Z" fill="#3E7A31"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(522, 138) rotate(54)">4</text>

                    <!-- 12 --> <path d="M300,300 L187,77 A300,300 0 0 0 123,123 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M196,96 L187,77 A300,300 0 0 0 123,123 L138,138 A300,300 0 0 1 196,96 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M240,182 L230,164 A300,300 0 0 0 192,192 L206,206 A300,300 0 0 1 240,182 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(462, 78) rotate(36)">18</text>

                    <!-- 9 --> <path d="M300,300 L123,123 A300,300 0 0 0 77,187 Z" fill="#EFDEAD"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M138,138 L123,123 A300,300 0 0 0 77,187 L96,196 A300,300 0 0 1 138,138 Z" fill="#3E7A31"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M206,206 L192,192 A300,300 0 0 0 164,230 L182,240 A300,300 0 0 1 206,206 Z" fill="#3E7A31"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(385, 38) rotate(18)">1</text>

                    <!-- 14 --> <path d="M300,300 L77,187 A300,300 0 0 0 53,261 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M96,196 L77,187 A300,300 0 0 0 53,261 L74,264 A300,300 0 0 1 96,196 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M182,240 L164,230 A300,300 0 0 0 149,276 L169,279 A300,300 0 0 1 182,240 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(300, 25) rotate(0)">20</text>

                    <!-- 11 --> <path d="M300,300 L53,261 A300,300 0 0 0 53,339 Z" fill="#EFDEAD"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M74,264 L53,261 A300,300 0 0 0 53,339 L74,336 A300,300 0 0 1 74,264 Z" fill="#3E7A31"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M169,279 L149,276 A300,300 0 0 0 149,324 L169,321 A300,300 0 0 1 169,279 Z" fill="#3E7A31"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(215, 38) rotate(342)">5</text>

                    <!-- 8 --> <path d="M300,300 L53,339 A300,300 0 0 0 77,413 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M74,336 L53,339 A300,300 0 0 0 77,413 L96,404 A300,300 0 0 1 74,336 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M169,321 L149,324 A300,300 0 0 0 164,370 L182,360 A300,300 0 0 1 169,321 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(138, 78) rotate(324)">12</text>

                    <!-- 16 --> <path d="M300,300 L77,413 A300,300 0 0 0 123,477 Z" :fill="simple16"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M96,404 L77,413 A300,300 0 0 0 123,477 L138,462 A300,300 0 0 1 96,404 Z" :fill="double16"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M182,360 L164,370 A300,300 0 0 0 192,408 L206,394 A300,300 0 0 1 182,360 Z" :fill="triple16"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(78, 138) rotate(306)">9</text>

                    <!-- 7 --> <path d="M300,300 L123,477 A300,300 0 0 0 187,523 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M138,462 L123,477 A300,300 0 0 0 187,523 L196,504 A300,300 0 0 1 138,462 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M206,394 L192,408 A300,300 0 0 0 230,436 L240,418 A300,300 0 0 1 206,394 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(38, 215) rotate(288)">14</text>

                    <!-- 19 --> <path d="M300,300 L187,523 A300,300 0 0 0 261,547 Z" :fill="simple19"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M196,504 L187,523 A300,300 0 0 0 261,547 L264,526 A300,300 0 0 1 196,504 Z" :fill="double19"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M240,418 L230,436 A300,300 0 0 0 276,451 L279,431 A300,300 0 0 1 240,418 Z" :fill="triple19"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(25, 300) rotate(270)">11</text>

                    <!-- 3 --> <path d="M300,300 L261,547 A300,300 0 0 0 339,547 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M264,526 L261,547 A300,300 0 0 0 339,547 L336,526 A300,300 0 0 1 264,526 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M279,431 L276,451 A300,300 0 0 0 324,451 L321,431 A300,300 0 0 1 279,431 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(38, 385) rotate(252)">8</text>

                    <!-- 17 --> <path d="M300,300 L339,547 A300,300 0 0 0 413,523 Z" :fill="simple17"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M336,526 L339,547 A300,300 0 0 0 413,523 L404,504 A300,300 0 0 1 336,526 Z" :fill="double17"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M321,431 L324,451 A300,300 0 0 0 370,436 L360,418 A300,300 0 0 1 321,431 Z" :fill="triple17"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(78, 462) rotate(234)">16</text>

                    <!-- 2 --> <path d="M300,300 L413,523 A300,300 0 0 0 477,477 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M404,504 L413,523 A300,300 0 0 0 477,477 L462,462 A300,300 0 0 1 404,504 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M360,418 L370,436 A300,300 0 0 0 408,408 L394,394 A300,300 0 0 1 360,418 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(138, 522) rotate(216)">7</text>

                    <!-- 15 --> <path d="M300,300 L477,477 A300,300 0 0 0 523,413 Z" :fill="simple15"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M462,462 L477,477 A300,300 0 0 0 523,413 L504,404 A300,300 0 0 1 462,462 Z" :fill="double15"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M394,394 L408,408 A300,300 0 0 0 436,370 L418,360 A300,300 0 0 1 394,394 Z" :fill="triple15"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(215, 562) rotate(198)">19</text>

                    <!-- 10 --> <path d="M300,300 L523,413 A300,300 0 0 0 547,339 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M504,404 L523,413 A300,300 0 0 0 547,339 L526,336 A300,300 0 0 1 504,404 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M418,360 L436,370 A300,300 0 0 0 451,324 L431,321 A300,300 0 0 1 418,360 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(300, 575) rotate(180)">3</text>

                    <!-- 6 --> <path d="M300,300 L547,339 A300,300 0 0 0 547,261 Z" fill="#EFDEAD"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M526,336 L547,339 A300,300 0 0 0 547,261 L526,264 A300,300 0 0 1 526,336 Z" fill="#3E7A31"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M431,321 L451,324 A300,300 0 0 0 451,276 L431,279 A300,300 0 0 1 431,321 Z" fill="#3E7A31"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(385, 562) rotate(162)">17</text>

                    <!-- 13 --> <path d="M300,300 L547,261 A300,300 0 0 0 523,187 Z" fill="#1C1A1D"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M526,264 L547,261 A300,300 0 0 0 523,187 L504,196 A300,300 0 0 1 526,264 Z" fill="#BB2A32"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M431,279 L451,276 A300,300 0 0 0 436,230 L418,240 A300,300 0 0 1 431,279 Z" fill="#BB2A32"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(462, 522) rotate(144)">2</text>
                    
                    <!-- 4 --> <path d="M300,300 L523,187 A300,300 0 0 0 477,123 Z" fill="#EFDEAD"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M504,196 L523,187 A300,300 0 0 0 477,123 L462,138 A300,300 0 0 1 504,196 Z" fill="#3E7A31"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M418,240 L436,230 A300,300 0 0 0 408,192 L394,206 A300,300 0 0 1 418,240 Z" fill="#3E7A31"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(522, 462) rotate(126)">15</text>
                    
                    <!-- 18 --> <path d="M300,300 L477,123 A300,300 0 0 0 413,77 Z" :fill="simple18"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M462,138 L477,123 A300,300 0 0 0 413,77 L404,96 A300,300 0 0 1 462,138 Z" :fill="double18"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M394,206 L408,192 A300,300 0 0 0 370,164 L360,182 A300,300 0 0 1 394,206 Z" :fill="triple18"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(562, 385) rotate(108)">10</text>
                    
                    <!-- 1 --> <path d="M300,300 L413,77 A300,300 0 0 0 339,53 Z" fill="#EFDEAD"/>
                    <!--   double --> <path stroke="black" stroke-width="1" d="M404,96 L413,77 A300,300 0 0 0 339,53 L336,74 A300,300 0 0 1 404,96 Z" fill="#3E7A31"/>
                    <!--   triple --> <path stroke="black" stroke-width="1" d="M360,182 L370,164 A300,300 0 0 0 324,149 L321,169 A300,300 0 0 1 360,182 Z" fill="#3E7A31"/>
                    <!--   nombre --> <text font-family="Arial, Helvetica, sans-serif" font-size="24" text-anchor="middle" alignment-baseline="middle" fill="white" transform="translate(575, 300) rotate(90)">6</text>
                </g>

                <!-- outer bull --> <circle cx="300" cy="300" r="35" stroke="black" stroke-width="2" :fill="bull"/>
                <!-- inner bull --> <circle cx="300" cy="300" r="14" stroke="black" stroke-width="2" :fill="doubleBull"/>
            </svg>
        </div>
        
        <div class="commentary-container">
            <RadioSpeaker
                :is-always-enable="true"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>


.desktop-view-container {

    .players-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        position: absolute;
        left: 5%;
        top: 5%;
    }

    .dartboard {
        position: absolute;
        top: calc(50% - 400px);
        right: 5%;
        width: 800px;
        height: 800px;
    }
}

</style>