import * as cheerio from 'cheerio';
import { scrapeCanonicalTag } from './canonicalTag.js';

export async function scrapePagination($, pageUrl, headers = {}) {
    const paginationResults = [];
    const foundUrls = new Set();

    const resolveUrl = (href) => {
        try {
            return new URL(href, pageUrl).href;
        } catch {
            return null;
        }
    };

    const paginationSelectors = [
        'a[rel="next"]',
        'a[rel="prev"]',
        'a[href*="page="]',
        'a[href*="/page/"]',
        'ul.pagination a',
        '.pagination a',
        '.pager a',
    ];

    const paginationLinks = [];
    paginationSelectors.forEach((selector) => {
        $(selector).each((_, el) => {
            const href = $(el).attr('href');
            const text = $(el).text().trim();
            const absUrl = resolveUrl(href);
            if (absUrl && !foundUrls.has(absUrl)) {
                foundUrls.add(absUrl);
                paginationLinks.push({ text, href: absUrl });
            }
        });
    });

    for (const link of paginationLinks) {
        const entry = {
            anchorText: link.text,
            url: link.href,
            statusCode: null,
            canonicalUrl: null,
            finalUrl: null,
            finalUrlStatusCode: null,
        };

        try {
            // 1️⃣ Fetch the original pagination URL and extract canonical
            const res = await fetch(link.href, {
                headers: {
                    'User-Agent': 'SEO-Checker',
                    'Accept': 'text/html',
                    ...headers,
                },
                redirect: 'follow',
            });

            entry.statusCode = res.status;
            entry.finalUrl = res.url; // fetch automatically resolves redirects
            entry.finalUrlStatusCode = res.status; // same status code for final URL

            const html = await res.text();
            const $$ = cheerio.load(html);
            const canonicalData = await scrapeCanonicalTag($$, link.href);
            entry.canonicalUrl = canonicalData.canonicalUrl || null;

        } catch (err) {
            console.error(`Pagination fetch failed for ${link.href}:`, err.message);
        }

        paginationResults.push(entry);
    }

    return { pagination: paginationResults };
}
