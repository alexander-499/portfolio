<script setup lang="ts">
import type { CustomIconState } from "@/composables/useCustomIcon";
import { useSettingsStore } from "@/stores/settings";
import { motionTransitions } from "@/utils/constants";

const settingsStore = useSettingsStore();

defineProps<{
  state: CustomIconState;
}>();
</script>

<template>
  <svg v-animate="{ rotate: state.isBooped ? -15 : 0 }" v-transition="motionTransitions.springy2">
    <g v-animate="{ scale: settingsStore.colorScheme === 'light' ? 1 : 0 }" v-transition="settingsStore.colorScheme === 'light' ? motionTransitions.springy4 : {}">
      <circle cx="12" cy="12" r="4" v-animate="{ r: state.isBooped ? 3 : 4 }" v-transition="motionTransitions.springy2"/>
      <line x1="12" y1="4" x2="12" y2="2"/>
      <line x1="12" y1="20" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="4" y2="12"/>
      <line x1="22" y1="12" x2="20" y2="12"/>
      <line x1="6.34" y1="17.66" x2="4.93" y2="19.07"/>
      <line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/>
    </g>
    <path
      d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      v-animate="{ opacity: settingsStore.colorScheme !== 'light' ? 1 : 0, scale: settingsStore.colorScheme === 'light' ? 4/9 : 1 }"
      v-transition="{ default: motionTransitions.springy2, opacity: {} }"
    />
  </svg>
</template>