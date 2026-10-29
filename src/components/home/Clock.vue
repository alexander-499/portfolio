<script setup lang="ts">
import { useTemporalNow } from "@vueuse/core";

const { now } = useTemporalNow({ timezone: "Europe/Berlin" });
</script>

<template>
  <div class="clock">
    <div class="main">
      <div class="clock-face">
        <div>
          <span v-for="digit in 12" :key="digit" class="digit" :style="{ '--clock-digit': digit }">{{ digit }}</span>
          <span v-for="tick in 60" :key="tick" class="tick" :class="tick % 5 === 0 ? 'major' : 'minor'" :style="{ '--clock-tick': tick }"/>
          <div class="hand hour" :style="{ rotate: ((now.hour % 12) / 12) * 360 + (now.minute / 60) * 30 + 'deg' }"/>
          <div class="hand minute" :style="{ rotate: (now.minute / 60) * 360 + 'deg' }"/>
          <div class="hand second" :style="{ rotate: (now.second / 60) * 360 + 'deg' }"/>
          <div class="center"><div/></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clock .main {
  .clock-face {
    background-image: linear-gradient(-45deg, #3e3e3f, #161616, #3e3e3f);
    border: 1px solid var(--color-border-subtle);
    border-radius: var(--border-radius-round);
    padding: 0.5rem;

    > div {
      height: 10rem;
      width: 10rem;
      position: relative;
      background-color: #f5f5f5;
      border-radius: var(--border-radius-round);
      box-shadow: 0 0 16px #0008 inset;

      .digit {
        position: absolute;
        top: calc(50% + var(--clock-digit-radius) * sin(var(--clock-digit-angle)));
        left: calc(50% + var(--clock-digit-radius) * cos(var(--clock-digit-angle)));
        color: black;
        font-family: var(--font-family-base);
        font-size: 1.375rem;
        translate: -50% -50%;
        --clock-digit-radius: 38%;
        --clock-digit-angle: calc((var(--clock-digit) / 12) * 1turn - 0.25turn);
      }

      .tick {
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: var(--border-radius-round);
        transform: translate(-50%, -50%) rotate(calc((var(--clock-tick) / 60) * 1turn)) translateY(-76px);

        &.minor {
          height: 4px;
          width: 1px;
          background-color: #000c;
        }

        &.major {
          height: 5px;
          width: 2px;
          background-color: black;
        }
      }

      .hand {
        position: absolute;
        top: 50%;
        left: 50%;
        transform-origin: 50% calc(100% - 12px);
        translate: -50% calc(-100% + 12px);
        background-color: black;
        border-radius: var(--border-radius-round);
        box-shadow: 0 0 8px 2px #0002;

        &.hour {
          height: 56px;
          width: 5px;
          background-color: #262626;
        }

        &.minute {
          height: 80px;
          width: 4px;
          background-color: #262626;
        }

        &.second {
          height: 78px;
          width: 2px;
          background-color: var(--color-accent-red);
        }
      }

      .center {
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: var(--color-accent-red);
        padding: 0.0625rem;
        translate: -50% -50%;
        border-radius: var(--border-radius-round);

        div {
          height: 0.25rem;
          width: 0.25rem;
          background-color: #262626;
        }
      }
    }
  }
}
</style>