<script setup lang="ts">
import type { CustomIconState } from "@/composables/useCustomIcon";
import { useUiStore } from "@/stores/ui";
import { motionTransitions } from "@/utils/constants";

const uiStore = useUiStore();

defineProps<{
  state: CustomIconState;
}>();
</script>

<template>
  <svg>
    <line
      x1="4"
      x2="20"
      v-animate="{
        y1: state.active ? 12 : !uiStore.isMobileMenu ? state.isBooped ? 8 : 5 : state.isBooped ? 7 : 4,
        y2: state.active ? 12 : !uiStore.isMobileMenu ? state.isBooped ? 8 : 5 : state.isBooped ? 17 : 20
      }"
      v-transition="motionTransitions.springy4"
    />
    <line x1="4" y1="12" x2="20" y2="12" v-animate="{ opacity: !uiStore.isMobileMenu ? 1 : 0 }"/>
    <line
      x1="4"
      x2="20"
      v-animate="{
        y1: state.active ? 12 : !uiStore.isMobileMenu ? state.isBooped ? 16 : 19 : state.isBooped ? 17 : 20,
        y2: state.active ? 12 : !uiStore.isMobileMenu ? state.isBooped ? 16 : 19 : state.isBooped ? 7 : 4
      }"
      v-transition="motionTransitions.springy4"
    />
  </svg>
</template>