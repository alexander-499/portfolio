<script setup lang="ts">
import { useBlog } from "@/composables/useBlog";

const { blogArticles } = useBlog();
</script>

<template>
  <section class="articles">
    <div class="heading">
      <h1>Articles</h1>
      <Button href="/rss.xml" target="_blank"><Icon name="rss" target=".button"/></Button>
    </div>
    <div class="article-list">
      <RouterLink v-for="article in blogArticles" :key="article.slug" :to="{ name: 'blog-article', params: { slug: article.slug } }">
        <time :datetime="article.meta.published">
          <span class="year">{{ new Date(article.meta.published).getUTCFullYear() }}</span>
          <span class="month">
            <span v-for="char in new Date(article.meta.published).toLocaleString('en-US', { month: 'short' })" :key="char">{{ char }}</span>
          </span>
          <span class="day">
            <span v-for="char in String(new Date(article.meta.published).getUTCDate()).padStart(2, '0')" :key="char">{{ char }}</span>
          </span>
        </time>
        <div class="content">
          <span :style="{ viewTransitionName: `blog-article-title-${article.slug}` }">{{ article.meta.title }}</span>
          <p v-if="article.meta.description" :style="{ viewTransitionName: `blog-article-description-${article.slug}` }">{{ article.meta.description }}</p>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
section.articles {
  .heading {
    display: flex;
    justify-content: space-between;

    h1 { font-size: 3rem; }
  }

  .article-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    a {
      display: flex;
      gap: 0.75rem;
      color: var(--color-text-secondary);
      text-decoration: none;

      time {
        width: 2.5rem;
        display: flex;
        flex-direction: column;
        text-transform: uppercase;
        font-feature-settings: "tnum" 1;

        .month, .day {
          display: flex;
          justify-content: space-between;
        }

        .year { font-size: 0.9375rem; }
        .month { font-size: 1.125rem; }

        .day {
          font-size: 1.875rem;
          margin-top: -0.25rem;
        }
      }
    }

    .content {
      span {
        color: var(--color-text-primary);
        font-size: 2rem;
        font-weight: 700;
      }
    }
  }
}
</style>