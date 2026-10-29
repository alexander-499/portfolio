<script setup lang="ts">
withDefaults(defineProps<{
  variant?: "info" | "warning" | "error" | "check",
}>(), {
  variant: "info"
});
</script>

<template>
  <aside class="aside" :data-variant="variant">
    <Icon v-if="variant === 'info'" name="info"/>
    <Icon v-else-if="variant === 'warning'" name="triangle-alert"/>
    <Icon v-else-if="variant === 'error'" name="circle-x"/>
    <Icon v-else-if="variant === 'check'" name="circle-check"/>
    <div class="main">
      <slot/>
    </div>
  </aside>
</template>

<style scoped>
.aside {
  position: relative;
  background-color: alpha(from var(--aside-color) / 0.1);
  border: 2px solid var(--aside-color);
  border-radius: 24px 12px 12px;
  corner-top-left-shape: scoop;
  padding: 0.75rem 0.75rem 0.75rem 2rem;

  &[data-variant="info"] { --aside-color: var(--color-accent-blue); }

  &[data-variant="warning"] {
    corner-top-left-shape: var(--superellipse-ios-negative);
    --aside-color: var(--color-accent-gold);
  }

  &[data-variant="error"] { --aside-color: var(--color-accent-red); }
  &[data-variant="check"] { --aside-color: var(--color-accent-green); }

  .icon {
    height: 2rem;
    width: 2rem;
    position: absolute;
    top: -1rem;
    left: -1rem;
    color: var(--aside-color);
  }

  .main {
    &:deep(strong) {
      display: inline-block;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    &:deep(p) { text-wrap: pretty; }
    &:deep(p:last-child) { margin-bottom: 0; }
  }
}
</style>