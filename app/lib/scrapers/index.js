import * as cheerio from 'cheerio';
import { scrapeMeta } from './meta';
import { scrapeHeadings } from './headings';
import { scrapeCanonical } from './canonical';

export function scrapeWithCheerio(html) {
    const $ = cheerio.load(html);

    return {
        ...scrapeMeta($),
        ...scrapeHeadings($),
        ...scrapeCanonical($),
    }
}