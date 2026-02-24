import * as cheerio from 'cheerio';
import { getRedirects } from '../utils/getRedirects';
import { checkRobotsTxt } from '../utils/checkRobotsTxt';
import { scrapeCanonicalTags } from './canonicalTags';
import { scrapeMetaRobotsAndXRobotsTag } from './metaRobotsAndXRobotsTag';

export async function scrapeHreflang($, pageUrl, headers = {}) {
    const hreflangs = [];

    $('link[hreflang]').each((_, el) => {
        const href = $(el).attr('href')?.trim();
        const hreflang = $(el).attr('hreflang')?.trim();
        if (href && hreflang) {
            hreflangs.push({
                source: '<link>',
                hreflang,
                url: href,
            });
        }
    });

    const linkHeader = headers['link'] || headers['Link'];
    if (linkHeader) {
        const matches = linkHeader.matchAll(
            /<([^>]+)>;\s*(?:rel=["']?alternate["']?;\s*hreflang=["']?([a-zA-Z0-9-]+)["']?|hreflang=["']?([a-zA-Z0-9-]+)["']?;\s*rel=["']?alternate["']?)/gi
        );
        for (const match of matches) {
            const hreflang = (match[2] || match[3] || '').toLowerCase();
            const href = match[1];
            hreflangs.push({
                source: 'HTTP header',
                hreflang,
                url: href
            });
        }
    }

    const results = [];

    for (const item of hreflangs) {
        try {
            let absoluteUrl;
            try {
                absoluteUrl = new URL(item.url, pageUrl).href;
            } catch {
                results.push({ ...item, error: `Invalid URL: ${item.url}` });
                continue;
            }

            const redirectInfo = await getRedirects(absoluteUrl);

            const initialUrl = redirectInfo.initialUrl;
            const initialUrlStatusCode = redirectInfo.initialUrlStatusCode;
            const finalUrl = redirectInfo.finalUrl;
            const finalUrlStatusCode = redirectInfo.finalUrlStatusCode;

            const robotsTxt = await checkRobotsTxt(finalUrl);

            let metaRobotsAndXRobotsTag = null;
            let canonicalTags = null;

            try {
                const response = await fetch(finalUrl);
                if (response.ok) {
                    const html = await response.text();
                    const $page = cheerio.load(html);

                    metaRobotsAndXRobotsTag = scrapeMetaRobotsAndXRobotsTag($page);
                    canonicalTags = (await scrapeCanonicalTags($page, finalUrl)).canonicalTags;
                }
            } catch {
                // HTML fetch failed — skip
            }

            results.push({
                ...item,

                initialUrl,
                initialUrlStatusCode,
                robotsTxt,
                metaRobotsAndXRobotsTag: metaRobotsAndXRobotsTag?.metaRobotsAndXRobotsTag || null,
                canonicalTags,
                finalUrl,
                finalUrlStatusCode,
                redirects: redirectInfo.redirects
            });

        } catch (err) {
            results.push({ ...item, error: err.message });
        }
    }

    return { hreflang: results };
}

