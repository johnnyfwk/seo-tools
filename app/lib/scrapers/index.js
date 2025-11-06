// import * as cheerio from 'cheerio';
// import { scrapeMeta } from './meta';
// import { scrapeHeadings } from './headings';
// import { scrapeCanonical } from './canonical';
// import { scrapePageLinks } from './pageLinks';
// import { scrapeImages } from './images';
// import { scrapeSchema } from './schema';
// import { scrapeHreflang } from './hreflang';
// import { scrapeOpenGraphTags } from './openGraph';
// import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
// import { scrapeViewport } from './viewport';

// export async function scrapeWithCheerio(html, pageUrl,  headers = {}) {
//     const $ = cheerio.load(html);

//     const hreflangResult = await scrapeHreflang($, pageUrl, headers);
//     const openGraph = await scrapeOpenGraphTags($, pageUrl);

//     return {
//         ...scrapeMeta($),
//         ...scrapeHeadings($),
//         ...scrapeCanonical($),
//         ...await scrapePageLinks($, pageUrl),
//         images: await scrapeImages($, pageUrl),
//         ...scrapeSchema($),
//         ...hreflangResult,
//         ...openGraph,
//         ...scrapeHtmlLanguageAttribute($),
//         ...scrapeViewport($),
//     }
// }


import * as cheerio from 'cheerio';

import { scrapeMetaRobotsTag } from './metaRobotsTag';
import { scrapeMetaTitle } from './metaTitle';
import { scrapeMetaDescription } from './metaDescription';
import { scrapeHeadings } from './headings';
import { scrapeCanonicalUrl } from './canonicalUrl';
import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
import { scrapeViewport } from './viewport';
import { scrapeLinks } from './links';

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
    } catch (err) {
        console.error(`Error scraping page ${pageUrl}:`, err);
    }

    return results;
}