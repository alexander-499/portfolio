import { computed, type Component } from "vue";

export interface BlogArticleMeta {
  title: string;
  description: string;
  published: string;
  updated: string;
  category: "api" | "math"
  draft?: boolean;
}

const modules = import.meta.glob<{ default: Component } & BlogArticleMeta>("../blog/*.md", { eager: true });

const articles = Object.entries(modules).map(([path, module]) => {
  const { default: component, ...meta } = module;
  const slug = path.split("/").pop()!.replace(".md", "");
  return { slug, component, meta };
}).filter(a => import.meta.env.DEV || !a.meta.draft);

export function useBlog() {
  const blogArticles = computed(() => articles.toSorted((a, b) => new Date(b.meta.published).getTime() - new Date(a.meta.published).getTime()));
  const getBlogArticle = (slug: string) => articles.find(a => a.slug === slug);

  return { blogArticles, getBlogArticle };
}