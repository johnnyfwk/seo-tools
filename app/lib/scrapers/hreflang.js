import * as cheerio from 'cheerio';
import { scrapeCanonical } from './canonicalUrl';
import { checkRobotsTxt } from './robotsTxt';

export async function scrapeHreflang($, pageUrl, headers = {}) {
    const hreflangs = [];

    // 1️⃣ Collect <link hreflang>
    $('link[hreflang]').each((i, el) => {
        const href = $(el).attr('href')?.trim();
        const hreflang = $(el).attr('hreflang')?.trim();

        hreflangs.push({
            source: '<link>',
            hreflang,
            url: href,
            statusCode: null,
            isIndexable: null,
        });
    });

    // 2️⃣ Collect hreflangs from HTTP headers (if any)
    const linkHeader = headers['link'] || headers['Link'];
    if (linkHeader) {
        const matches = linkHeader.matchAll(
            /<([^>]+)>;\s*rel=["']?alternate["']?;\s*hreflang=["']?([a-zA-Z-]+)["']?/g
        );
        for (const match of matches) {
            hreflangs.push({
                source: 'HTTP header',
                hreflang: match[2].toLowerCase(),
                url: match[1],
                statusCode: null,
                isIndexable: null,
            });
        }
    }

    const results = [];

    // 3️⃣ Fetch each hreflang URL
    for (const item of hreflangs) {
        if (!item.url) {
            results.push(item);
            continue;
        }

        try {
            const absoluteUrl = new URL(item.url, pageUrl).href;
            let statusCode = null;
            let isIndexable = false;
            let isNoindex = false;
            let canonical = absoluteUrl;
            let robotsTxtCheck = { allowed: true, reason: 'Not checked' };

            const response = await fetch(absoluteUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)',
                },
                redirect: 'manual', // do not follow redirects
            });

            statusCode = response.status;
            
            // 4️⃣ Only check indexability if status is 200
            if (statusCode === 200) {
                const html = await response.text();
                const $page = cheerio.load(html);

                canonical = scrapeCanonical($page).canonicalUrl || absoluteUrl;
                const metaRobots = $page('meta[name="robots"]').attr('content') || '';
                isNoindex = metaRobots.toLowerCase().includes('noindex');
                robotsTxtCheck = await checkRobotsTxt(absoluteUrl, '*');

                isIndexable = !isNoindex && robotsTxtCheck.allowed;
            } else {
                isIndexable = false;
            }

            results.push({
                ...item,
                statusCode,
                finalUrl: absoluteUrl,
                isIndexable,
                robotsTxtCheck,
                isNoindex,
                canonicalUrl: canonical,
            });
        } catch (err) {
            results.push({
                ...item,
                statusCode: 'Error',
                finalUrl: item.url,
                isIndexable: null,
            });
        }
    }

    return { hreflang: results };
}