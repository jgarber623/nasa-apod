const { EleventyHtmlBasePlugin, EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  // Front Matter Data
  eleventyConfig.setFrontMatterParsingOptions({ language: "json" });

  // Global Data
  eleventyConfig.addGlobalData("app", require("./src/manifest.webmanifest.json"));

  // Passthrough File Copy
  eleventyConfig
    .addPassthroughCopy("./src/assets")
    .addPassthroughCopy("./src/favicon.ico")
    .addPassthroughCopy({
      "./src/manifest.webmanifest.json": "manifest.webmanifest",
    });

  // Libraries
  eleventyConfig.setLiquidOptions(require("./lib/libraries/liquid.js"));

  // Shortcodes
  eleventyConfig.addAsyncShortcode("youtube_embed", require("./lib/shortcodes/youtube_embed.js"));

  // Plugins
  eleventyConfig.addPlugin(require("@jgarber/eleventy-plugin-markdown"));
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  return {
    dir: {
      input: "./src",
    },
    pathPrefix: "/nasa-apod/",
  };
};
