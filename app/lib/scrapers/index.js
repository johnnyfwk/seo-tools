import * as cheerio from 'cheerio';

import { scrapeMetaRobotsAndXRobotsTag } from './metaRobotsAndXRobotsTag';
import { scrapeCanonicalTags } from './canonicalTags';
import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
import { scrapeViewport } from './viewport';
import { scrapeTitleTags } from './titleTags';
import { scrapeMetaDescriptions } from './metaDescriptions';
import { scrapeHeadings } from './headings';
import { scrapeLinks } from './links';
import { scrapeStructuredData } from './structuredData';
import { scrapeImages } from './images';
import { scrapeHreflang } from './hreflang';
import { scrapeOpenGraph } from './openGraph';
import { scrapePagination } from './pagination';

function shouldScrape(optionKey, opts) {
    if (opts[optionKey] === false) return false;
    
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
            xmlMode: false,
            decodeEntities: true
        });

    const results = {};

    try {
        if (shouldScrape('metaRobotsAndXRobotsTag', opts)) {
            Object.assign(results, scrapeMetaRobotsAndXRobotsTag($, headers));
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

        if (shouldScrape('titleTags', opts)) {
            Object.assign(results, scrapeTitleTags($));
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

        if (shouldScrape('structuredData', opts)) {
            Object.assign(results, scrapeStructuredData($));
        }

        if (shouldScrape('images', opts)) {
            Object.assign(results, await scrapeImages($, pageUrl, { checkStatus: true }));
        }

        if (shouldScrape('hreflang', opts)) {
            Object.assign(results, await scrapeHreflang($, pageUrl, headers));
        }

        if (shouldScrape('openGraph', opts)) {
            Object.assign(results, await scrapeOpenGraph($, pageUrl));
        }

        if (shouldScrape('pagination', opts)) {
            Object.assign(results, await scrapePagination($, pageUrl, headers));
        }
        
    } catch (err) {
        console.error(`Error scraping page ${pageUrl}:`, err);
    }

    return results;
}