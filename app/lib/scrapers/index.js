import * as cheerio from 'cheerio';
import { scrapeMeta } from './meta';
import { scrapeHeadings } from './headings';
import { scrapeCanonical } from './canonical';
import { scrapePageLinks } from './pageLinks';
import { scrapeImages } from './images';

export async function scrapeWithCheerio(html, pageUrl) {
    const $ = cheerio.load(html);

    return {
        ...scrapeMeta($),
        ...scrapeHeadings($),
        ...scrapeCanonical($),
        ...await scrapePageLinks($, pageUrl),
        images: await scrapeImages($),
    }
}