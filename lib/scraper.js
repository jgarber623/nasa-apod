#!/usr/bin/env node

const fs = require('node:fs');
const process = require('node:process');
const { Buffer } = require('node:buffer');

const cheerio = require('cheerio');
const fetch = require('node-fetch');
const TurndownService = require('turndown');

const apod = require('../src/_data/apod.json');

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);

    this.response = response;
  }
}

process
  .argv
  .slice(2)
  .map(date => new Date(date).toISOString().split('T')[0])
  .forEach(async (date) => {
    const outputFilePath = `./src/_posts/${date}.md`;

    if (fs.existsSync(outputFilePath)) {
      console.log(`❗️ A post already exists at ${outputFilePath}! Skipping...`);
      return;
    }

    const baseUrl = new URL(apod.url);
    const canonicalUrl = new URL(`ap${date.replace(/-/g, '').substring(2)}.html`, baseUrl);

    // Parse data from APOD website
    console.log('🐶 Fetching and parsing data from APOD website...');

    const $ = cheerio.load(await (async () => {
      const response = await fetch(canonicalUrl);

      if (response.ok) {
        return await response.text();
      } else {
        throw new HTTPResponseError(response);
      }
    })());

    // Convert relative URLs to absolute URLs
    $('a').each((index, anchor) => $(anchor).attr('href', new URL($(anchor).attr('href'), baseUrl)));
    $('img').each((index, img) => $(img).attr('src', new URL($(img).attr('src'), baseUrl)));

    const title = $('title').html().split(/\s+[-–—]\s+/)[1].trim();

    // Either an `<a>` or an `<iframe>`
    const $media = $('center > h1 + p + p > :last-child');
    // Either an `<img>` or `undefined`
    const $image = $media.find('> img');

    const hdImageUrl = $media.attr('href');
    const imageUrl = $media.attr('src') || $image.attr('src');
    const imageAlt = $image.attr('alt')?.replace(/\n|\s+/g, ' ').trim();

    // Find image credits and convert to Markdown
    //
    // Note: Spaces in URLs will be encoded to `%20` so that markdown-it will
    // correctly convert the links to `<a>` elements.
    const credit =
      new TurndownService()
        .turndown(
          $('center + center')
            .html()
            .split(/<br>[\n\r\s]*(?:<b>[\s\S]*?Credit[\s\S]*?:\s*?<\/b>)?/)[1]
        )
        .replace(/\]\(.+?\)/g, (match) => match.replace(/\s+/g, '%20'));

    // Find post content and convert to Markdown
    const content =
      new TurndownService().turndown(
        $('center + center + p')
          .html()
          .replace(/<b>\s*?Explanation:\s*?<\/b>/, '')
      );

    const data = Buffer.from(
      `---json\n${JSON.stringify({ title, canonicalUrl, hdImageUrl, imageUrl, imageAlt, credit }, null, 2)}\n---\n\n${content}\n`
    );

    console.log(`💾 Saving new post to ${outputFilePath}!`);
    fs.writeFileSync(outputFilePath, data);
  });
