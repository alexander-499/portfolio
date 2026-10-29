<script lang="ts">
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import lightPlus from "@shikijs/themes/light-plus";
import darkPlus from "@shikijs/themes/dark-plus";

import jsLang from "@shikijs/langs/js";
import shellLang from "@shikijs/langs/shell";

let highlighterPromise: Promise<any> | null = null;
function getSharedHighlighter() {
  if (!highlighterPromise) highlighterPromise = createHighlighterCore({
    themes: [darkPlus, lightPlus],
    langs: [jsLang, shellLang],
    engine: createJavaScriptRegexEngine()
  });
  return highlighterPromise;
}
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useClipboard } from "@vueuse/core";

const clipboard = useClipboard();

const props = withDefaults(defineProps<{
  lang?: string;
  code: string;
}>(), {
  lang: "text"
});

const html = ref<string | null>(null);
let requestId = 0;

watch(() => [props.lang, props.code] as const, async ([lang, code]) => {
  const id = ++requestId;
  html.value = null;
  const highlighter = await getSharedHighlighter();

  if (!highlighter.getLoadedLanguages().includes(lang)) try {
    await highlighter.loadLanguage(lang as any);
  } catch {
    if (!highlighter.getLoadedLanguages().includes("text")) await highlighter.loadLanguage("text");
  }

  if (id === requestId) html.value = highlighter.codeToHtml(code, {
    lang: highlighter.getLoadedLanguages().includes(lang) ? lang : "text",
    themes: {
      light: "light-plus",
      dark: "dark-plus"
    },
    defaultColor: false
  });
}, { immediate: true });
</script>

<template>
  <div class="code-block">
    <Button v-if="clipboard.isSupported" size="small" @click="clipboard.copy(code)">
      <Icon v-if="!clipboard.copied.value" name="copy"/>
      <Icon v-else name="check"/>
    </Button>
    <div v-if="html" class="content" v-html="html"/>
    <div v-else class="content-fallback">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  position: relative;
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  corner-shape: var(--superellipse-ios);
  overflow: hidden;

  .button {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
  }

  .content :deep(.shiki), .content-fallback pre {
    line-height: 1.6;
    white-space: pre-wrap;
    padding: 1rem;
  }
}

:root[data-theme="light"] .code-block .content :is(.shiki, .shiki span) { color: var(--shiki-light); }
:root[data-theme="dark"] .code-block .content :is(.shiki, .shiki span) { color: var(--shiki-dark); }
</style>