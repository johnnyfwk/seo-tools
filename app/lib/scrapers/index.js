import * as cheerio from 'cheerio';

import { scrapeMetaRobotsTag } from './metaRobotsTag';
import { scrapeCanonicalTags } from './canonicalTags';
import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
import { scrapeViewport } from './viewport';
import { scrapeMetaTitles } from './metaTitles';
import { scrapeMetaDescriptions } from './metaDescriptions';
import { scrapeHeadings } from './headings';
import { scrapeLinks } from './links';
import { scrapeSchemaMarkup } from './schemaMarkup';
import { scrapeImages } from './images';
import { scrapeHreflang } from './hreflang';
import { scrapeOpenGraph } from './openGraph';
import { scrapeXmlSitemap } from './xmlSitemap';
import { scrapePagination } from './pagination';

function shouldScrape(optionKey, opts) {
    if (opts[optionKey] === false) return false; // explicitly disabled
    return opts[optionKey] === true || opts.all === true;
}

export async function scrapeWithCheerio(
    html,
    pageUrl,
    headers = {},
    opts = {}
) {
    if (!html || !pageUrl) return {};

    const $ = typeof html === 'function' && html.root
        ? html
        : cheerio.load(html, {
            xmlMode: false,      // parse as lenient HTML
            decodeEntities: true // converts HTML entities
        });

    const results = {};

    try {
        if (shouldScrape('metaRobotsTag', opts)) {
            Object.assign(results, scrapeMetaRobotsTag($, headers));
        }

        if (shouldScrape('canonicalTags', opts)) {
            Object.assign(results, await scrapeCanonicalTags($, pageUrl));
        }

        if (shouldScrape('htmlLanguageAttribute', opts)) {
            Object.assign(results, scrapeHtmlLanguageAttribute($));
        }

        if (shouldScrape('viewport', opts)) {
            Object.assign(results, scrapeViewport($));
        }

        if (shouldScrape('metaTitles', opts)) {
            Object.assign(results, scrapeMetaTitles($));
        }

        if (shouldScrape('metaDescriptions', opts)) {
            Object.assign(results, scrapeMetaDescriptions($));
        }

        if (shouldScrape('headings', opts)) {
            Object.assign(results, scrapeHeadings($));
        }

        if (shouldScrape('links', opts)) {
            Object.assign(results, await scrapeLinks($, pageUrl));
        }

        if (shouldScrape('schema', opts)) {
            Object.assign(results, scrapeSchemaMarkup($));
        }

        // if (shouldScrape('images', opts)) {
        //     Object.assign(results, await scrapeImages($, pageUrl, { checkStatus: true }));
        // }

        // if (shouldScrape('hreflang', opts)) {
        //     Object.assign(results, await scrapeHreflang($, pageUrl, headers));
        // }

        // if (shouldScrape('openGraph', opts)) {
        //     Object.assign(results, await scrapeOpenGraph($, pageUrl));
        // }

        // if (shouldScrape('xmlSitemap', opts)) {
        //     Object.assign(results, await scrapeXmlSitemap(pageUrl));
        // }

        // if (shouldScrape('pagination', opts)) {
        //     Object.assign(results, await scrapePagination($, pageUrl, headers));
        // }
    } catch (err) {
        console.error(`Error scraping page ${pageUrl}:`, err);
    }

    return results;
}