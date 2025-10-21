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
import { scrapeMetaTitle } from './metaTitle';
import { scrapeMetaDescription } from './metaDescription';
import { scrapeHeadings } from './headings';
export async function scrapeWithCheerio(
    html,
    pageUrl,
    headers = {},
    opts = {}
) {
    const $ = cheerio.load(html);

    const results = {};

    if (opts.metaTitle || opts.all) {
        Object.assign(results, scrapeMetaTitle($));
    }

    if (opts.metaDescription || opts.all) {
        Object.assign(results, scrapeMetaDescription($));
    }

    if (opts.headings || opts.all) {
        Object.assign(results, scrapeHeadings($));
    }

    return results;
}