<script setup lang="ts">
import type { CustomIconState } from "@/composables/useCustomIcon";
import { motionTransitions } from "@/utils/constants";

defineProps<{
  state: CustomIconState;
}>();
</script>

<template>
  <svg>
    <path d="M15 3h6v6" v-animate="{ x: state.isBooped ? 3 : 0, y: state.isBooped ? -3 : 0 }" v-transition="motionTransitions.springy4"/>
    <line x1="10" y1="14" x2="21" y2="3" v-animate="{ x2: state.isBooped ? 24 : 21, y2: state.isBooped ? 0 : 3 }" v-transition="motionTransitions.springy4"/>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  </svg>
</template>