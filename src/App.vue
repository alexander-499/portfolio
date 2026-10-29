<script setup lang="ts">
import { watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import { useSettingsStore } from "@/stores/settings";
import { toStartCase } from "@/utils";

const route = useRoute();
const settingsStore = useSettingsStore();

watchEffect(() => document.documentElement.setAttribute("data-theme", settingsStore.colorScheme));

watch(() => [route.name, route.params.slug], () => {
  const name = route.name === "blog-article" ? route.params.slug : route.name;
  const title = typeof name === "string" && name !== "home" ? toStartCase(name) : null;
  document.title = [title, "Alexander499"].filter(Boolean).join(" \u{2022} ");
}, { immediate: true });
</script>

<template>
  <Header/>
  <main>
    <RouterView/>
  </main>
  <Footer/>
</template>

<style scoped>
main {
  flex: 1;
  padding: 2rem 0;

  &:deep(> section) {
    max-width: 60rem;
    margin: 0 auto;
    padding-inline: 1rem;

    &:not(:last-of-type) { margin-bottom: 0.5rem; }
  }
}
</style>