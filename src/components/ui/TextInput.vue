<script setup lang="ts">
defineProps<{
  type?: "text" | "number" | "search";
}>();

const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    class="text-field"
    :type
    autocomplete="off"
  >
</template>

<style scoped>
.text-field {
  color: var(--color-text-secondary);
  background-color: var(--color-control);
  font-size: 1rem;
  font-family: var(--font-family-base);
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  padding: 0.5625rem 0.5rem;
  user-select: none;

  &::placeholder { color: var(--color-text-tertiary); }
}
</style>