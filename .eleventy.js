const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.amendLibrary('md', markdown => {
    return markdown.set({
      breaks: true,
      typographer: true
    });
  });

  eleventyConfig
    .addPassthroughCopy('./assets')
    .addPassthroughCopy('./favicon.ico');
};
