import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from "@11ty/eleventy";

import eleventyPluginLiquid from "@jgarber/eleventy-plugin-liquid";
import eleventyPluginMarkdown from "@jgarber/eleventy-plugin-markdown";

import youtubeEmbedShortcode from "./lib/shortcodes/youtube_embed.js";

import manifest from "./src/manifest.webmanifest.json" with { type: "json" };

export default function(eleventyConfig) {
  // Front Matter Data
  eleventyConfig.setFrontMatterParsingOptions({ language: "json" });

  // Global Data
  eleventyConfig.addGlobalData("app", manifest);

  // Passthrough File Copy
  eleventyConfig
    .addPassthroughCopy("./src/assets")
    .addPassthroughCopy("./src/*.ico")
    .addPassthroughCopy({
      "./src/manifest.webmanifest.json": "manifest.webmanifest",
    });

  // Shortcodes
  eleventyConfig.addAsyncShortcode("youtube_embed", youtubeEmbedShortcode);

  // Plugins
  eleventyConfig.addPlugin(eleventyPluginLiquid, {
    globals: {
      dates: {
        display: "%B %e<sup>%q</sup>, %Y",
        iso8601: "%Y-%m-%d",
      },
    },
  });

  eleventyConfig.addPlugin(eleventyPluginMarkdown);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
}

export const config = {
  dir: {
    input: "./src",
  },
  pathPrefix: "/nasa-apod/",
};
