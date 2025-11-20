import * as cheerio from 'cheerio';
import { getRedirects } from '../utils/getRedirects';
import { checkRobotsTxt } from '../utils/checkRobotsTxt';
import { scrapeCanonicalTags } from './canonicalTags';
import { scrapeMetaRobotsTag } from './metaRobotsTag';
import * as utils from '@/app/lib/utils/utils';

export async function scrapeHreflang($, pageUrl, headers = {}) {
    const hreflangs = [];

    // 1️⃣ Collect <link hreflang>
    $('link[hreflang]').each((_, el) => {
        const href = $(el).attr('href')?.trim();
        const hreflang = $(el).attr('hreflang')?.trim();
        if (href && hreflang) {
            hreflangs.push({
                source: '<link>',
                hreflang, url: href
            });
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
            hreflangs.push({
                source: 'HTTP header',
                hreflang, url: href
            });
        }
    }

    const results = [];

    // Process each hreflang URL
    for (const item of hreflangs) {
        try {
            if (!item.url) {
                results.push({ ...item, error: 'Missing URL' });
                continue;
            }

            let absoluteUrl;
            try {
                absoluteUrl = new URL(item.url, pageUrl).href;
            } catch (err) {
                results.push({ ...item, error: `Invalid URL: ${item.url}` });
                continue;
            }

            // Get final URL and redirects
            const redirectInfo = await getRedirects(absoluteUrl);
            const initialUrl = redirectInfo.initialUrl;
            const initialUrlStatusCode = redirectInfo.initialStatusCode;
            const finalUrl = redirectInfo.finalUrl;
            const finalUrlStatusCode = redirectInfo.finalUrlStatusCode;

            let robotsTxtData = {
                url: null,
                exists: null,
                blocked: null,
                allowRules: [],
                disallowRules: [],
                sitemaps: [],
            };

            if (finalUrlStatusCode === 200) {
                robotsTxtData = await checkRobotsTxt(finalUrl);
            }

            let canonicalData = {
                canonicalTags: {
                    tags: [],
                    globalIssues: [],
                }
            };

            let metaRobotsData = {
                metaRobotsTag: {
                    content: "",
                    htmlTagContent: "",
                    xRobotsTagContent: "",
                    allowsIndexing: null,
                    allowsFollowing: null,
                }
            };

            // Only fetch HTML if final URL is OK
            if (finalUrlStatusCode === 200) {
                try {
                    const html = await fetch(finalUrl).then(r => r.text());
                    const $page = cheerio.load(html);
                    canonicalData = await scrapeCanonicalTags($page, finalUrl);
                    metaRobotsData = scrapeMetaRobotsTag($page);
                    // Optional: implement your robots.txt check here
                } catch (err) {
                    results.push({
                        ...item,
                        hreflangUrl: finalUrl,
                        finalUrlStatusCode,
                        error: `Failed to fetch HTML: ${err.message}`,
                    });
                    continue;
                }
            }

            results.push({
                ...item,
                initialUrl: initialUrl,
                initialUrlStatusCode: initialUrlStatusCode,
                finalUrl,
                finalUrlStatusCode,
                robotsTxtData,
                metaRobotsData: metaRobotsData.metaRobotsTag,
                canonicalData: canonicalData.canonicalTags,
                redirects: redirectInfo.redirects || [],
            });

        } catch (err) {
            results.push({ ...item, error: err.message });
        }
    }

    return { hreflang: results };
}
