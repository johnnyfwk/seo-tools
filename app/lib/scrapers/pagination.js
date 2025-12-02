import * as cheerio from 'cheerio';
import { getRedirects } from '../utils/getRedirects.js';
import { scrapeCanonicalTags } from './canonicalTags.js';
import { browserHeaders } from '../utils/browserHeaders.js';

export async function scrapePagination($, pageUrl, headers = {}) {
    const paginationResults = [];
    const foundUrls = new Set();

    const resolveUrl = (href) => {
        if (!href) return null;
        try {
            return new URL(href, pageUrl).href;
        } catch {
            return null;
        }
    };

    const paginationSelectors = [
        'a[rel="next"]',
        'a[rel="prev"]',
        '[aria-label="Next"]',
        '[aria-label="Previous"]',
        '.pagination a[href]',
        'nav[role="navigation"] .pagination a[href]'
    ];

    const paginationLinks = [];

    for (const selector of paginationSelectors) {
        $(selector).each((_, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            const absUrl = resolveUrl(href);

            if (
                absUrl &&
                absUrl !== pageUrl &&
                !foundUrls.has(absUrl)
            ) {
                foundUrls.add(absUrl);
                paginationLinks.push({ text, href: absUrl });
            }
        });
    }

    for (const link of paginationLinks) {
        const entry = {
            anchorText: link.text,
            initialUrl: link.href,
            initialUrlStatusCode: null,
            finalUrl: null,
            finalUrlStatusCode: null,
            canonicalTags: [],
        };

        try {
            const response = await getRedirects(link.href);

            entry.initialUrlStatusCode = response.initialUrlStatusCode;
            entry.finalUrl = response.finalUrl; // fetch automatically resolves redirects
            entry.finalUrlStatusCode = response.finalUrlStatusCode; // same status code for final URL

            const finalHtmlResponse = await fetch(response.finalUrl, {
                method: "GET",
                headers: browserHeaders,
            });
            const html = await finalHtmlResponse.text();
            const $$ = cheerio.load(html);

            const canonicalData = await scrapeCanonicalTags($$, response.finalUrl);
            entry.canonicalTags = canonicalData.canonicalTags.tags;

        } catch (err) {
            console.error(`Pagination fetch failed for ${link.href}:`, err.message);
        }

        paginationResults.push(entry);
    }

    return { pagination: paginationResults };
}
