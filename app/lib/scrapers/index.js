import * as cheerio from 'cheerio';

import { scrapeMetaRobotsTag } from './metaRobotsTag';
import { scrapeMetaTitle } from './metaTitle';
import { scrapeMetaDescription } from './metaDescription';
import { scrapeHeadings } from './headings';
import { scrapeCanonicalTag } from './canonicalTag';
import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
import { scrapeViewport } from './viewport';
import { scrapeLinks } from './links';
import { scrapeSchemaMarkup } from './schemaMarkup';
import { scrapeImages } from './images';
import { scrapeHreflang } from './hreflang';
import { scrapeOpenGraph } from './openGraph';
import { scrapeXmlSitemap } from './xmlSitemap';
import { scrapePagination } from './pagination';

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
        if (opts.metaRobotsTag || opts.all) {
            Object.assign(results, scrapeMetaRobotsTag($, headers));
        }

        if (opts.canonicalUrl || opts.all) {
            Object.assign(results, await scrapeCanonicalTag($, pageUrl));
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

        if (opts.images || opts.all) {
            Object.assign(results, await scrapeImages($, pageUrl, { checkStatus: true }));
        }

        if (opts.hreflang || opts.all) {
            Object.assign(results, await scrapeHreflang($, pageUrl, headers));
        }

        if (opts.openGraph || opts.all) {
            Object.assign(results, await scrapeOpenGraph($, pageUrl));
        }

        if (opts.xmlSitemap || opts.all) {
            Object.assign(results, await scrapeXmlSitemap(pageUrl));
        }

        if (opts.pagination || opts.all) {
            Object.assign(results, await scrapePagination($, pageUrl, headers));
        }
    } catch (err) {
        console.error(`Error scraping page ${pageUrl}:`, err);
    }

    return results;
}