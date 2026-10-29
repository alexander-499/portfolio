<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <section class="not-found">
    <h1>Not Found!?</h1>
    <p>The page you’re looking for doesn’t exist. Try checking the URL.</p>
    <div class="links">
      <Button :to="{ name: 'home' }"><Icon name="house"/>Return Home</Button>
      <Button v-if="route.query.from" :href="(route.query.from as string)"><Icon name="rotate-cw"/>Reload</Button>
    </div>
    <span class="error-code">404</span>
  </section>
</template>

<style scoped>
section.not-found {
  height: 23rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  color: var(--color-text-secondary);
  text-align: center;
  margin-top: 4rem;

  h1 {
    font-size: min(8rem, 15vw);
    font-weight: 900;
    white-space: nowrap;
    color: hsl(v-bind("Math.floor(Math.random() * 360)"), 100%, 50%);
  }

  .links {
    display: flex;
    gap: 0.5rem;
  }

  .error-code {
    position: absolute;
    color: var(--color-text-tertiary);
    font-size: min(40rem, 45vw);
    font-weight: 900;
    pointer-events: none;
    user-select: none;
    z-index: -1;
  }
}

:root[data-theme="light"] section.not-found .error-code { opacity: 0.25; }
:root[data-theme="dark"] section.not-found .error-code { opacity: 0.05; }
</style>