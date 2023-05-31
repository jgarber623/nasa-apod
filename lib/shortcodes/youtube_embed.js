const fetch = require('node-fetch');

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);

    this.response = response;
  }
}

module.exports = async (url) => {
  const { pathname: path } = new URL(url);
  const id = path.split('/').pop();

  const { html } = await (async () => {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);

    if (response.ok) {
      return await response.json();
    } else {
      throw new HTTPResponseError(response);
    }
  })();

  return html;
};
