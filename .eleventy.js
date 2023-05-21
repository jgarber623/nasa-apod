module.exports = eleventyConfig => {
  eleventyConfig.amendLibrary('md', markdown => {
    return markdown.set({
      breaks: true,
      typographer: true
    });
  });

  eleventyConfig.addPassthroughCopy('./assets');
};
