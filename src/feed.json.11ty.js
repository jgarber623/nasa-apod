module.exports = class {
  data() {
    return {
      permalink: '/feed.json'
    };
  }

  async render({ apod, app, collections, permalink }) {
    const items = await Promise.all(
      collections
        .post
        .reverse()
        .slice(0, 30)
        .map(async post => {
          // Use Eleventy's configured markdown-it instance.
          const mdLib = post.template._templateRender._engine.engineLib;

          return {
            id: post.data.canonical_url,
            url: post.data.canonical_url,
            title: mdLib.renderInline(post.data.title),
            content_html: await this.renderFile('./src/_includes/post.liquid', post),
            image: post.data.image_url,
            date_published: post.date
          };
        })
    );

    return JSON.stringify({
      version: 'https://jsonfeed.org/version/1.1',
      title: app.name,
      home_page_url: apod.url,
      feed_url: this.htmlBaseUrl(permalink, app.start_url),
      description: app.description,
      icon: this.htmlBaseUrl(app.icons[1].src, app.start_url),
      favicon: this.htmlBaseUrl(app.icons[0].src, app.start_url),
      authors: apod.authors,
      language: app.lang,
      items: items
    });
  }
};
