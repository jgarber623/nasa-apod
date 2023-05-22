module.exports = class {
  data() {
    return {
      permalink: '/feed.json'
    }
  }

  async render({ collections, permalink, site }) {
    const url = 'https://jgarber623.github.io/nasa-apod';

    const items = await Promise.all(
      collections
        .post
        .map(async post => {
          // Use Eleventy's configured markdown-it instance.
          const mdLib = post.template._templateRender._engine.engineLib;

          return {
            id: post.data.canonical_url,
            url: post.data.canonical_url,
            title: mdLib.renderInline(post.data.title),
            content_html: await this.renderFile('./_includes/figure.liquid', post),
            image: post.data.image_url,
            date_published: post.date
          }
        })
        .reverse()
    );

    return JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: 'NASA Astronomy Picture of the Day',
      home_page_url: 'https://apod.nasa.gov',
      feed_url: `${url}${permalink}`,
      description: 'Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.',
      icon: `${url}/assets/images/icon-512x512.png`,
      favicon: `${url}/assets/images/icon-128x128.png`,
      authors: [
        {
          name: 'Robert Nemiroff',
          url: 'https://www.mtu.edu/physics/department/faculty/nemiroff/'
        },
        {
          name: 'Jerry Bonnell',
          url: 'https://apod.nasa.gov/htmltest/jbonnell/www/bonnell.html'
        }
      ],
      language: 'en-US',
      items: items
    });
  }
};
