const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function(eleventyConfig) {
  eleventyConfig.amendLibrary('md', require('./lib/libraries/markdown.js'));

  eleventyConfig.setLiquidOptions(require('./lib/libraries/liquid.js'));

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig
    .addPassthroughCopy('./assets')
    .addPassthroughCopy('./favicon.ico');
};
