<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useBrowserLocation, useMutationObserver, useShare, useWindowScroll, useWindowSize } from "@vueuse/core";
import Giscus from "@giscus/vue";
import { useBlog } from "@/composables/useBlog";
import { formatDate, when } from "@/utils";
import { useSettingsStore } from "@/stores/settings";

const share = useShare();
const browserLocation = useBrowserLocation();
const windowScroll = useWindowScroll();
const windowSize = useWindowSize();
const { getBlogArticle } = useBlog();
const settingsStore = useSettingsStore();

const props = defineProps<{
  slug: string
}>();

const article = getBlogArticle(props.slug);

const handleShare = () => share.share({
  title: `${article?.meta.title} \u{b7} Alexander499's Blog`,
  url: browserLocation.value.href
});

const articleContent = useTemplateRef("article-content");
const headings = ref<{
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}[]>([]);

const anchoredHeadingId = computed(() => decodeURIComponent(browserLocation.value.hash?.slice(1) || ""));
const activeHeadingId = ref("");

function updateActiveHeading() {
  if (!headings.value.length) return activeHeadingId.value = "";

  let activeHeading = headings.value[0];

  for (const heading of headings.value) {
    if (heading.element.getBoundingClientRect().top <= windowSize.height.value * 0.5) activeHeading = heading;
    else break;
  }

  if (windowScroll.y.value + windowSize.height.value >= document.documentElement.scrollHeight - 2)
    activeHeading = headings.value[headings.value.length - 1];
  activeHeadingId.value = activeHeading?.id as string;
}

function updateHeadings() {
  const container = articleContent.value;

  if (!container) {
    headings.value = [];
    activeHeadingId.value = "";
    return;
  }

  headings.value = [
    { id: "introduction", text: "Introduction", level: 2, element: container },
    ...Array.from(container.querySelectorAll<HTMLHeadingElement>(":is(h2, h3, h4, h5, h6)[id]")).map(element => ({
      id: element.id,
      text: element.textContent?.trim() ?? "",
      level: Number(element.tagName.slice(1)),
      element
    }))
  ];

  updateActiveHeading();
}

watch([windowScroll.y, windowSize.height], updateActiveHeading, { flush: "post" });
useMutationObserver(articleContent, updateHeadings, { childList: true, subtree: true, characterData: true });
onMounted(updateHeadings);
</script>

<template>
  <section class="article">
    <article>
      <div class="header">
        <h1 :style="{ viewTransitionName: `blog-article-title-${article?.slug}` }">{{ article?.meta.title }}</h1>
        <p v-if="article?.meta.description" class="description" :style="{ viewTransitionName: `blog-article-description-${article.slug}` }">{{ article.meta.description }}</p>
        <p>
          Categorized under <code class="bg">{{ article?.meta.category }}</code>.
          Published on <time :datetime="article?.meta.published">{{ formatDate(article?.meta.published as string) }}</time>.
          Updated on <time :datetime="article?.meta.updated">{{ formatDate(article?.meta.updated as string) }}</time>.
        </p>
        <span class="divider">{{ "&nbsp;".repeat(24) }}</span>
      </div>
      <div id="introduction" ref="article-content" class="content">
        <component :is="article?.component" class="markdown"/>
      </div>
      <Giscus
        repo="alexander-499/portfolio"
        repo-id="R_kgDOQvYAGQ"
        category="Blog"
        category-id="DIC_kwDOQvYAGc4C0RIs"
        mapping="pathname"
        strict="0"
        reactions-enabled="1"
        emit-metadata="1"
        input-position="top"
        :theme="settingsStore.colorScheme"
        loading="lazy"
      />
    </article>
    <aside>
      <div class="links">
        <Button :href="`https://www.x.com/intent/post?url=${article?.meta.title}:%20${browserLocation.href}`" target="_blank" title="Share on &Xopf;"><Icon name="brand-x"/></Button>
        <Button :href="`mailto:?subject=${article?.meta.title}&body=${browserLocation.href}`" title="Share via email"><Icon name="mail"/></Button>
        <Button v-if="share.isSupported" title="Share" @click="handleShare"><Icon name="link"/></Button>
      </div>
      <nav v-if="headings.length">
        <h2>Table of Contents</h2>
        <ol>
          <li v-for="heading in headings" :key="heading.id" :data-level="heading.level" :class="{ anchored: anchoredHeadingId === heading.id, active: activeHeadingId === heading.id }">
            <a :href="`#${heading.id}`" :aria-current="when(anchoredHeadingId === heading.id, 'location')">{{ heading.text }}</a>
          </li>
        </ol>
      </nav>
    </aside>
  </section>
</template>

<style scoped>
section.article {
  max-width: 70rem;
  display: flex;
  align-items: flex-start;
  gap: 4rem;

  article {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      h1 {
        font-size: 2rem;
        text-wrap: pretty;
      }

      p {
        color: var(--color-text-secondary);
        &.description { font-size: 1.25rem; }
        time { color: var(--color-text-primary); }
      }

      .divider {
        margin: 0 0 3rem;
        color: var(--color-accent-blue);
        font-size: 2rem;
        text-decoration: underline wavy 4px;
        text-align: center;
        user-select: none;
      }
    }

    .content {
      margin-bottom: 8rem;
      scroll-margin-top: 5rem;
    }
  }

  aside {
    position: sticky;
    top: 6rem;
    display: flex;
    flex: 0 0 16rem;
    flex-direction: column;
    gap: 1rem;

    .links {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    nav {
      h2 {
        font-size: 1.25rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      ol {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        list-style: none;

        li {
          color: var(--color-text-secondary);

          &[data-level="3"] {
            font-size: 0.875rem;
            padding-left: 1rem;
          }

          &:hover, &.anchored { color: var(--color-text-primary); }
          &.active { color: var(--color-accent-blue); }

          a {
            color: inherit;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>