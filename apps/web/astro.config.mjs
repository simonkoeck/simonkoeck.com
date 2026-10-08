import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://simonkoeck.com",
  trailingSlash: "never",
  output: "static",
  adapter: cloudflare({ prerenderEnvironment: "node" }),
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        if (item.url === "https://simonkoeck.com/") {
          item.priority = 1.0;
          item.changefreq = "weekly";
        } else if (item.url.includes("/writeups/")) {
          item.priority = 0.8;
          item.changefreq = "monthly";
        } else if (item.url.endsWith("/writeups")) {
          item.priority = 0.9;
          item.changefreq = "weekly";
        } else if (item.url.includes("/blog/")) {
          item.priority = 0.7;
          item.changefreq = "monthly";
        } else if (item.url.endsWith("/blog")) {
          item.priority = 0.8;
          item.changefreq = "weekly";
        } else {
          item.priority = 0.5;
          item.changefreq = "monthly";
        }
        return item;
      },
    }),
    icon(),
  ],
prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  experimental: {
    rustCompiler: true,
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      optimizeDeps: {
        exclude: ["@cloudflare/vite-plugin"],
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
    rehypePlugins: [
      [rehypeExternalLinks, {
        target: "_blank",
        rel(element) {
          const href = element.properties?.href;
          if (typeof href === "string" && (
            href.includes("simonkoeck.com") ||
            href.includes("looksphishy.org") ||
            href.includes("namply.com")
          )) {
            return ["noopener"];
          }
          return ["noopener", "noreferrer"];
        },
      }],
    ],
  },
});
