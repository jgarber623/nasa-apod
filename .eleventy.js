const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function(eleventyConfig) {
  // Passthrough File Copy
  eleventyConfig
    .addPassthroughCopy('./src/assets')
    .addPassthroughCopy('./src/favicon.ico')
    .addPassthroughCopy('./src/manifest.webmanifest');

  // Libraries
  eleventyConfig.amendLibrary('md', require('./lib/libraries/markdown.js'));
  eleventyConfig.setLiquidOptions(require('./lib/libraries/liquid.js'));

  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  return {
    dir: {
      input: './src'
    }
  }
};
