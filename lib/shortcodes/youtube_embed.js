const HTTPResponseError = require("../HTTPResponseError");

module.exports = async (url) => {
  const { pathname: path } = new URL(url);
  const id = path.split("/").pop();

  const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);

  if (response.ok) {
    const { html } = await response.json();

    return html;
  } else {
    throw new HTTPResponseError(response);
  }
};
