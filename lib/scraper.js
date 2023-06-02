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

    const base_url = new URL(apod.url);
    const canonical_url = new URL(`ap${date.replace(/-/g, '').substring(2)}.html`, base_url);

    // Parse data from NASA APOD API
    console.log('🐶 Fetching and parsing data from NASA APOD API...');

    const { hdurl: hd_image_url, title, url: image_url } = await (async () => {
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`);

      if (response.ok) {
        return await response.json();
      } else {
        throw new HTTPResponseError(response);
      }
    })();

    // Parse data from APOD website
    console.log('🐶 Fetching and parsing data from APOD website...');

    const $ = cheerio.load(await (async () => {
      const response = await fetch(canonical_url);

      if (response.ok) {
        return await response.text();
      } else {
        throw new HTTPResponseError(response);
      }
    })());

    // Convert relative URLs to absolute URLs
    $('a').each((index, anchor) => $(anchor).attr('href', new URL($(anchor).attr('href'), base_url)));

    // Find image credits and copyright information
    const credit =
      new TurndownService().turndown(
        $('center + center')
          .html()
          .split(/<b>\s*?(?:Image|Video)\s+Credit[\s\S]*?:\s*?<\/b>/)[1]
      )
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Find post content and convert to Markdown
    const content =
      new TurndownService().turndown(
        $('center + center + p')
          .html()
          .replace(/<b>\s*?Explanation:\s*?<\/b>/, '')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      );

    const data = Buffer.from(`---json\n${JSON.stringify({ title, canonical_url, hd_image_url, image_url, credit }, null, 2)}\n---\n\n${content}\n`);

    console.log(`💾 Saving new post to ${outputFilePath}!`);
    fs.writeFileSync(outputFilePath, data);
  });
