import * as cheerio from 'cheerio';
import { scrapeMeta } from './meta';
import { scrapeHeadings } from './headings';
import { scrapeCanonical } from './canonical';
import { scrapePageLinks } from './pageLinks';
import { scrapeImages } from './images';
import { scrapeSchema } from './schema';
import { scrapeHreflang } from './hreflang';
import { scrapeOpenGraphTags } from './openGraph';
import { scrapeHtmlLanguageAttribute } from './htmlLanguageAttribute';
import { scrapeViewport } from './viewport';

export async function scrapeWithCheerio(html, pageUrl,  headers = {}) {
    const $ = cheerio.load(html);

    const hreflangResult = await scrapeHreflang($, pageUrl, headers);
    const openGraph = await scrapeOpenGraphTags($, pageUrl);

    return {
        ...scrapeMeta($),
        ...scrapeHeadings($),
        ...scrapeCanonical($),
        ...await scrapePageLinks($, pageUrl),
        images: await scrapeImages($, pageUrl),
        ...scrapeSchema($),
        ...hreflangResult,
        ...openGraph,
        ...scrapeHtmlLanguageAttribute($),
        ...scrapeViewport($),
    }
}