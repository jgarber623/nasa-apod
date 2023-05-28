# nasa-apod

Providing a fuller feed of content from NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) (APOD) website.

I _love_ the APOD website, but [the official RSS feed](https://apod.nasa.gov/apod.rss) doesn't do it for me. A tiny image. The briefest of truncated text.

This project uses a combination of [NASA's APOD API](https://api.nasa.gov) and some clunky HTML scraping to generate an improved feed of posts for consumption in your feed reader of choice. Built daily with [Eleventy](https://www.11ty.dev) and [GitHub Actions](https://docs.github.com/en/actions).

## Usage

Add any of the following URLs to your preferred feed reader:

- [Atom v1.0](https://jgarber623.github.io/nasa-apod/feed.atom)
- [JSON Feed v1.1](https://jgarber623.github.io/nasa-apod/feed.json)

## License

The source code for this project is dedicated to the public domain per the [Creative Commons CC0 1.0 Universal Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).

The content of the Markdown (`*.md`) files in the `./src/_posts` folder was parsed from NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) website and its corresponding [API](https://api.nasa.gov). [Specific rights apply](https://apod.nasa.gov/apod/lib/about_apod.html#srapply).

NASA's "Meatball" logo graphic was downloaded from the [Symbols of NASA](https://www.nasa.gov/audience/forstudents/5-8/features/symbols-of-nasa.html) website. Permission was not obtained in accordance with NASA's [Media Usage Guidelines](https://www.nasa.gov/multimedia/guidelines/index.html).
