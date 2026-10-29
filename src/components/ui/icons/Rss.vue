<script setup lang="ts">
import type { CustomIconState } from "@/composables/useCustomIcon";
import { motionTransitions } from "@/utils/constants";

defineProps<{
  state: CustomIconState;
}>();
</script>

<template>
  <svg>
    <path d="M4 11a9 9 0 0 1 9 9" v-animate="{ x: state.isBooped ? 1 : 0, y: state.isBooped ? -1 : 0 }" v-transition="motionTransitions.springy2"/>
    <path d="M4 4a16 16 0 0 1 16 16" v-animate="{ x: state.isBooped ? 2 : 0, y: state.isBooped ? -2 : 0 }" v-transition="{ ...motionTransitions.springy2, delay: 50 }"/>
    <circle cx="5" cy="19" r="1" fill="currentColor" v-animate="{ r: state.isBooped ? 2 : 1 }" v-transition="motionTransitions.springy"/>
  </svg>
</template>