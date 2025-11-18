import * as cheerio from 'cheerio';
// import { fetchRedirectInfo } from '../utils/fetchRedirectInfo';
import { scrapeCanonicalTags } from './canonicalTags';
// import { checkRobotsTxt } from './robotsTxt';
import { scrapeMetaRobotsTag } from './metaRobotsTag';

export async function scrapeHreflang($, pageUrl, headers = {}) {
    const hreflangs = [];

    // 1️⃣ Collect <link hreflang>
    $('link[hreflang]').each((_, el) => {
        const href = $(el).attr('href')?.trim();
        const hreflang = $(el).attr('hreflang')?.trim();
        if (href && hreflang) {
            hreflangs.push({ source: '<link>', hreflang, url: href });
        }
    });

    // 2️⃣ Collect hreflangs from headers
    const linkHeader = headers['link'] || headers['Link'];
    if (linkHeader) {
        const matches = linkHeader.matchAll(
            /<([^>]+)>;\s*(?:rel=["']?alternate["']?;\s*hreflang=["']?([a-zA-Z0-9-]+)["']?|hreflang=["']?([a-zA-Z0-9-]+)["']?;\s*rel=["']?alternate["']?)/gi
        );
        for (const match of matches) {
            const hreflang = (match[2] || match[3] || '').toLowerCase();
            const href = match[1];
            hreflangs.push({ source: 'HTTP header', hreflang, url: href });
        }
    }

    const results = [];

    // Helper: normalize URLs for comparison
    const normalizeUrl = (url) => {
        try {
            const u = new URL(url);
            return `${u.origin}${u.pathname.replace(/\/$/, '')}`.toLowerCase();
        } catch {
            return url.toLowerCase();
        }
    };

    // 3️⃣ Process each hreflang URL
    for (const item of hreflangs) {
        try {
            if (!item.url) {
                results.push({ ...item, error: 'Missing URL' });
                continue;
            }

            const absoluteUrl = new URL(item.url, pageUrl).href;

            // --- 3a. Check hreflang URL ---
            let canonicalData = { canonicalTags: [] };
            let metaRobotsData = { metaRobotsTag: { allowsIndexing: true, allowsFollowing: true } };
            let robotsTxtCheck = { allowed: true, reason: 'Not checked' };
            let hreflangUrlStatusCode = null;

            try {
                const res = await fetch(absoluteUrl, { method: 'GET', redirect: 'manual' });
                hreflangUrlStatusCode = res.status;
                if (res.ok) {
                    const html = await res.text();
                    const $page = cheerio.load(html);

                    canonicalData = await scrapeCanonicalTags($page, absoluteUrl);
                    metaRobotsData = scrapeMetaRobotsTag($page);
                    robotsTxtCheck = await checkRobotsTxt(absoluteUrl);
                }
            } catch (err) {
                results.push({
                    ...item,
                    hreflangUrl: absoluteUrl,
                    hreflangUrlStatusCode,
                    error: `Failed to fetch hreflang URL: ${err.message}`,
                });
                continue;
            }

            // --- 3b. Get final URL after redirects ---
            let finalUrl = absoluteUrl;
            let finalUrlStatusCode = null;

            try {
                const redirectInfo = await fetchRedirectInfo(absoluteUrl);
                finalUrl = redirectInfo.finalUrl || absoluteUrl;
                finalUrlStatusCode = redirectInfo.finalUrlStatusCode || null;
            } catch {
                finalUrlStatusCode = 'Error';
            }

            // --- 3c. Check if hreflang URL matches the first canonical tag ---
            let matchesCanonical = null;
            const firstCanonical = canonicalData.canonicalTags[0];
            if (firstCanonical && firstCanonical.resolvedUrl) {
                matchesCanonical = normalizeUrl(absoluteUrl) === normalizeUrl(firstCanonical.resolvedUrl);
            }

            const hreflangUrlIsIndexable =
                hreflangUrlStatusCode === 200 &&
                matchesCanonical &&
                metaRobotsData.metaRobotsTag.allowsIndexing &&
                robotsTxtCheck.allowed;

            results.push({
                ...item,
                hreflangUrl: absoluteUrl,
                hreflangUrlStatusCode,
                hreflangUrlIsIndexable,
                canonicalData: {
                    canonicalTags: canonicalData.canonicalTags,
                    matchesFirstCanonicalTag: matchesCanonical,
                },
                metaRobots: metaRobotsData.metaRobotsTag,
                robotsTxt: robotsTxtCheck,
                finalUrl,
                finalUrlStatusCode,
            });
        } catch (err) {
            results.push({ ...item, error: err.message });
        }
    }

    return { hreflang: results };
}
