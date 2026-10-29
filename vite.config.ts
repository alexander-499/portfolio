import { fileURLToPath, URL } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { defineConfig, type Plugin } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import { visualizer } from "rollup-plugin-visualizer";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import MarkdownItAnchor from "markdown-it-anchor";
import slugify from "@sindresorhus/slugify";
import temmlPlugin from "@traeblain/markdown-it-temml";
import matter, { type GrayMatterFile } from "gray-matter";
import { Feed } from "feed";
import { quantize } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";
import type { BlogArticleMeta } from "./src/composables/useBlog.ts";
import { when, copyrightYear } from "./src/utils/index.ts";

const root = "./src";

const generateRssPlugin = (siteUrl: string): Plugin => {
  async function generateRss(): Promise<string> {
    const baseUrl = new URL(siteUrl);
    const blogDir = resolve(process.cwd(), `${root}/blog`);
    const files = (await readdir(blogDir)).filter(file => file.endsWith(".md"));

    const feed = new Feed({
      title: "Alexander499's Blog",
      description: "Articles and tutorials for web developers.",
      id: baseUrl.href,
      link: new URL("/blog", baseUrl).href,
      language: "en",
      feedLinks: { rss: new URL("/rss.xml", baseUrl).href },
      copyright: `\u{a9} ${copyrightYear} Alexander`
    });

    const articles = await Promise.all(files.map(async file => {
      const { data } = matter(await readFile(resolve(blogDir, file), "utf8")) as GrayMatterFile<string> & { data: BlogArticleMeta };
      return !data.draft ? {
        ...data,
        date: new Date(data.published),
        url: new URL(`/blog/${encodeURIComponent(basename(file, ".md"))}`, baseUrl).href
      } : null;
    }));

    for (const article of articles.filter(a => a !== null).sort((a, b) => b.date.getTime() - a.date.getTime())) feed.addItem({
      title: article.title,
      description: article.description,
      id: article.url,
      link: article.url,
      date: article.date
    });

    return feed.rss2();
  }

  return {
    name: "generate-rss",
    configureServer(server) {
      server.middlewares.use("/rss.xml", async (_req, res, next) => {
        try {
          res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
          res.end(await generateRss());
        } catch (err) {
          next(err);
        }
      });
    },
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "rss.xml",
        source: await generateRss()
      });
    }
  };
};

function virtualWorldAtlasPlugin(): Plugin {
  const virtualId = "virtual:world-atlas";
  const resolvedId = `\0${virtualId}`;
  let isBuild = false;

  return {
    name: "virtual-world-atlas",
    configResolved: config => void (isBuild = config.command === "build"),
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;
      const source = await this.resolve("@cublya/world-atlas/countries-50m.json", undefined, { skipSelf: true });
      if (!source) throw new Error("World atlas not found.");
      this.addWatchFile(source.id);
      const topology = JSON.parse(await readFile(source.id, "utf8"));
      const prepared = presimplify(topology);
      const optimized = quantize(simplify(prepared, quantile(prepared, 0.45)), topology.transform ?? 1e5);
      const json = JSON.stringify(optimized);
      if (!isBuild) return `export default "data:application/json;base64,${Buffer.from(json).toString("base64")}";`;
      const assetId = this.emitFile({ type: "asset", name: "world-atlas.json", source: json });
      return `export default import.meta.ROLLDOWN_FILE_URL_${assetId};`;
    }
  };
}

export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    VueDevTools(),
    visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true
    }),
    Components({
      dirs: [`${root}/components/ui`],
      include: [/\.vue($|\?)/, /\.md($|\?)/],
      dts: `${root}/components.d.ts`,
      deep: true
    }),
    Markdown({
      markdownSetup(md) {
        md.use(MarkdownItAnchor as any, {
          slugify,
          permalink: MarkdownItAnchor.permalink.linkInsideHeader({
            symbol: /*html*/`<Icon name="hash" target="a"/>`,
            placement: "before",
            class: "anchor-link"
          })
        })

        md.renderer.rules.link_open = (tokens, i, options, env, self) => {
          tokens[i]?.attrSet("target", "_blank");
          tokens[i]?.attrSet("rel", "noopener noreferrer");
          return self.renderToken(tokens, i, options);
        };

        md.renderer.rules.fence = (tokens, i) => {
          const lang = tokens[i]?.info.trim().split(/\s+/u)[0];
          const code = md.utils.escapeHtml(JSON.stringify(tokens[i]?.content));
          return /*html*/`<CodeBlock :lang="${when(lang, `'${md.utils.escapeHtml(lang as string)}'`)}" :code="${code}"/>\n`;
        };

        md.use(temmlPlugin, { throwOnError: false });
      }
    }),
    generateRssPlugin("https://alexander499.de"),
    virtualWorldAtlasPlugin()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(root, import.meta.url))
    }
  }
});