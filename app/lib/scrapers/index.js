import * as cheerio from 'cheerio';

import { scrapeMetaRobotsTag } from './metaRobotsTag';
import { scrapeMetaTitle } from './metaTitle';
import { scrapeMetaDescription } from './metaDescription';
import { scrapeHeadings } from './headings';
import { scrapeCanonicalUrl } from './canonicalUrl';
import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
import { scrapeViewport } from './viewport';
import { scrapeLinks } from './links';
import { scrapeSchemaMarkup } from './schemaMarkup';

export async function scrapeWithCheerio(
    html,
    pageUrl,
    headers = {},
    opts = {}
) {
    if (!html || !pageUrl) return {};

    const $ = typeof html === 'function' && html.root ? html : cheerio.load(html);
    const results = {};

    try {
        if (opts.metaRobotsTag || opts.all) {
            Object.assign(results, scrapeMetaRobotsTag($, headers));
        }

        if (opts.canonicalUrl || opts.all) {
            Object.assign(results, scrapeCanonicalUrl($, pageUrl));
        }

        if (opts.htmlLanguageAttribute || opts.all) {
            Object.assign(results, scrapeHtmlLanguageAttribute($));
        }

        if (opts.viewport || opts.all) {
            Object.assign(results, scrapeViewport($));
        }

        if (opts.metaTitle || opts.all) {
            Object.assign(results, scrapeMetaTitle($));
        }

        if (opts.metaDescription || opts.all) {
            Object.assign(results, scrapeMetaDescription($));
        }

        if (opts.headings || opts.all) {
            Object.assign(results, scrapeHeadings($));
        }

        if (opts.links || opts.all) {
            Object.assign(results, await scrapeLinks($, pageUrl));
        }

        if (opts.schema || opts.all) {
            Object.assign(results, scrapeSchemaMarkup($));
        }
    } catch (err) {
        console.error(`Error scraping page ${pageUrl}:`, err);
    }

    return results;
}