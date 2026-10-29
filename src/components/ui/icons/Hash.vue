<script setup lang="ts">
import type { CustomIconState } from "@/composables/useCustomIcon";
import { motionTransitions } from "@/utils/constants";

defineProps<{
  state: CustomIconState;
}>();
</script>

<template>
  <svg>
    <line x1="4" x2="20" v-animate="{ y1: state.active ? 12 : state.isBooped ? 10 : 9, y2: state.active ? 12 : state.isBooped ? 10 : 9 }" v-transition="motionTransitions.spring"/>
    <line x1="4" x2="20" v-animate="{ y1: state.active ? 12 : state.isBooped ? 14 : 15, y2: state.active ? 12 : state.isBooped ? 14 : 15 }" v-transition="motionTransitions.spring"/>
    <line v-animate="{ x1: state.active ? 12 : state.isBooped ? 11 : 10, y1: state.active ? 4 : 3, x2: state.active ? 12 : state.isBooped ? 9 : 8, y2: state.active ? 20 : 21 }" v-transition="motionTransitions.spring"/>
    <line v-animate="{ x1: state.active ? 12 : state.isBooped ? 15 : 16, y1: state.active ? 4 : 3, x2: state.active ? 12 : state.isBooped ? 13 : 14, y2: state.active ? 20 : 21 }" v-transition="motionTransitions.spring"/>
  </svg>
</template>