const { EleventyRenderPlugin } = require('@11ty/eleventy');

module.exports = function(eleventyConfig) {
  eleventyConfig.amendLibrary('md', markdown => {
    return markdown.set({
      breaks: true,
      typographer: true
    });
  });

  eleventyConfig.setLiquidOptions({
    globals: {
      dates: {
        display: '%B %e<sup>%q</sup>, %Y',
        iso8601: '%Y-%m-%d',
        iso68601_with_time_and_zone: '%Y-%m-%dT%H:%M:%S%:z'
      }
    }
  });

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig
    .addPassthroughCopy('./assets')
    .addPassthroughCopy('./favicon.ico');
};
