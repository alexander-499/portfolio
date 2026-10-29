<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { useElementHover } from "@vueuse/core";
import { mod, type Indices } from "@/utils";

const gameList = [
  {
    name: "PEAK",
    image: "https://m.media-amazon.com/images/M/MV5BY2NkZTAxNTQtNDg0YS00ZDdhLTk4OTgtZWQyMzJmODJlYmVkXkEyXkFqcGc@._V1_.jpg",
    description: "Peak is a cooperative climbing game for up to four players. After crash-landing on an unknown island, players take the role of scouts attempting to ascend the mountain at its center."
  },
  {
    name: "Chants of Sennaar",
    image: "https://m.media-amazon.com/images/M/MV5BN2I1OGI1NDgtMTAxZi00OWJjLWE5OTUtODE1ZmEwNDI2MTMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "In this puzzle adventure game, play as the Traveler on a quest to reunite the Peoples of the Tower. Observe, listen, and decipher ancient languages in a universe inspired by the Myth of Babel."
  },
  {
    name: "Minecraft",
    image: "https://m.media-amazon.com/images/M/MV5BMjM4MzE0MGItY2U4OS00MTU5LTgwNWUtYzMxZjMzMTQ5Yjg1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    description: "Minecraft is a sandbox adventure game where players explore infinitely generated blocky worlds, gather resources, craft tools, and build anything they can imagine, either alone or with friends."
  }
] as const;

const game = ref<Indices<typeof gameList>>(0);
const increaseGame = (value: number = 1) => game.value = mod((game.value + value), gameList.length) as Indices<typeof gameList>;
const games = useTemplateRef("games");
const gamesIsHovered = useElementHover(games);
onMounted(() => setInterval(() => {
  if (!gamesIsHovered.value) increaseGame();
}, 7500));
</script>

<template>
  <div ref="games" class="games">
    <header><span><Icon name="gamepad2"/>Fav Games</span></header>
    <div class="main">
      <div class="carousel">
        <Button class="left" size="small" @click="increaseGame(-1)"><Icon name="arrow-left"/></Button>
        <Button class="right" size="small" @click="increaseGame()"><Icon name="arrow-right"/></Button>
        <div>
          <img :src="gameList[game].image" :alt="gameList[game].image">
        </div>
      </div>
      <p>{{ gameList[game].description }}</p>
    </div>
  </div>
</template>

<style scoped>
.games {
  .main {
    .carousel {
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .button {
        position: absolute;
  
        &.left { left: 0; }
        &.right { right: 0; }
      }
  
      div {
        display: flex;
  
        img {
          height: 10rem;
          aspect-ratio: 2/3;
          border: 1px solid var(--color-border-subtle);
          border-radius: 8px;
          object-fit: cover;
        }
      }
    }

  }
}
</style>