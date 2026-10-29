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
  <svg>
    <path
      d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
      v-animate="{ x: !settingsStore.soundEnabled ? 4 : 0, rotate: state.isBooped && !settingsStore.soundEnabled ? -15 : 0 }"
      v-transition="motionTransitions.springy2"
    />
    <path
      d="M16 9a5 5 0 0 1 0 6"
      v-animate="{ opacity: settingsStore.soundEnabled ? 1 : 0, x: state.isBooped && settingsStore.soundEnabled ? 4 : 0 }"
      v-transition="{ default: motionTransitions.springy, opacity: { delay: 50 } }"
    />
    <path
      d="M19.364 18.364a9 9 0 0 0 0-12.728"
      v-animate="{ opacity: settingsStore.soundEnabled ? 1 : 0, x: state.isBooped && settingsStore.soundEnabled ? 4 : 0 }"
      v-transition="{ default: { ...motionTransitions.springy, delay: 50 }, opacity: {} }"
    />
  </svg>
</template>