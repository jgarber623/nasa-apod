#!/usr/bin/env node

import fs from 'node:fs';
import process from 'node:process';
import { Buffer } from 'node:buffer';

import cheerio from 'cheerio';
import fetch from 'node-fetch';
import TurndownService from 'turndown';

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`);

    this.response = response;
  }
}

const fetchHtml = async (url) => {
  const response = await fetch(url)

  if (response.ok) {
    return await response.text();
  } else {
    throw new HTTPResponseError(response);
  }
};

const fetchJson = async (url) => {
  const response = await fetch(url);

  if (response.ok) {
    return await response.json();
  } else {
    throw new HTTPResponseError(response);
  }
};

process
  .argv
  .slice(2)
  .map(date => new Date(date))
  .forEach(async (date) => {
    const iso_date = date.toISOString().split('T')[0];
    const output_file_path = `./src/_posts/${iso_date}.md`;

    if (fs.existsSync(output_file_path)) {
      console.log(`❗️ A post already exists at ${output_file_path}! Skipping...`);
      return;
    }

    const base_url = 'https://apod.nasa.gov/apod/';

    const api_url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${iso_date}`;
    const canonical_url = `${base_url}ap${iso_date.replace(/-/g, '').substring(2)}.html`;

    // Parse data from NASA APOD API
    console.log('🐶 Fetching and parsing data from NASA APOD API...');
    const { hdurl: hd_image_url, title, url: image_url } = await fetchJson(api_url);

    // Parse data from APOD website
    console.log('🐶 Fetching and parsing data from APOD website...');
    const $ = cheerio.load(await fetchHtml(canonical_url));

    // Convert relative URLs to absolute URLs
    $('a').each((index, anchor) => $(anchor).attr('href', new URL($(anchor).attr('href'), new URL(base_url))));

    // Find image credits and copyright information
    const credit =
      $('center + center')
        .html()
        .split(/<b>\s*?Image Credit[\s\S]*?:\s*?<\/b>/)[1]
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

    console.log(`💾 Saving new post to ${output_file_path}!`);
    fs.writeFileSync(output_file_path, data);
  });
