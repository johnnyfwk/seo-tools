import { DOMParser } from '@xmldom/xmldom';

export async function scrapeXmlSitemap(targetUrl) {
    const baseUrl = new URL(targetUrl).origin;
    const visited = new Set();
    let foundSitemaps = new Set();
    let foundMatchIn = [];
    let sitemapUrls = [];

    const robotsUrl = `${baseUrl}/robots.txt`;

    // STEP 1: Extract sitemaps from robots.txt
    try {
        const robotsRes = await fetch(robotsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://yourdomain.com)',
            },
        });

        if (robotsRes.ok) {
            const text = await robotsRes.text();
            const matches = text.match(/^Sitemap:\s*(.+)$/gim);
            if (matches) sitemapUrls = matches.map(m => m.replace(/^Sitemap:\s*/i, '').trim());
        }
    } catch (err) {
        console.error('robots.txt fetch error:', err);
    }

    // STEP 2: Default to /sitemap.xml if nothing found
    if (sitemapUrls.length === 0) {
        sitemapUrls = [`${baseUrl}/sitemap.xml`];
    }

    async function fetchAndParseXml(url) {
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://yourdomain.com)',
                },
            });
            if (!res.ok) return null;
            const xml = await res.text();
            return new DOMParser().parseFromString(xml, 'application/xml');
        } catch (e) {
            console.error('sitemap fetch/parse error:', e);
            return null;
        }
    }

    async function parseSitemap(url) {
        if (visited.has(url)) return;
        visited.add(url);

        const xmlDoc = await fetchAndParseXml(url);
        if (!xmlDoc) return;

        foundSitemaps.add(url);

        // Sitemap index
        const sitemapEls = Array.from(xmlDoc.getElementsByTagName('sitemap'));
        for (const el of sitemapEls) {
            const loc = el.getElementsByTagName('loc')[0]?.textContent?.trim();
            if (loc) await parseSitemap(loc);
        }

        // URL set
        const urlEls = Array.from(xmlDoc.getElementsByTagName('url'));
        for (const el of urlEls) {
            const loc = el.getElementsByTagName('loc')[0]?.textContent?.trim();
            if (!loc) continue;
            if (new URL(loc).href.replace(/\/$/, '') === new URL(targetUrl).href.replace(/\/$/, '')) {
                foundMatchIn.push(url);
            }
        }
    }

    for (const sitemap of sitemapUrls) {
        await parseSitemap(sitemap);
    }

    // STEP 3: Build result
    if (foundSitemaps.size === 0) {
        return {
            xmlSitemap: {
                hasSitemap: false,
                urlFound: false,
                robotsTxtChecked: robotsUrl,
                message: 'No XML sitemaps found (none in robots.txt or /sitemap.xml).',
            },
        };
    }

    if (foundMatchIn.length > 0) {
        return {
            xmlSitemap: {
                hasSitemap: true,
                urlFound: true,
                robotsTxtChecked: robotsUrl,
                sitemapsChecked: Array.from(foundSitemaps),
                sitemapsContainingUrl: foundMatchIn,
                message: `✅ URL found in ${foundMatchIn.length} sitemap(s).`,
            },
        };
    }

    return {
        xmlSitemap: {
            hasSitemap: true,
            urlFound: false,
            robotsTxtChecked: robotsUrl,
            sitemapsChecked: Array.from(foundSitemaps),
            message: '❌ URL not listed in any sitemap(s).',
        },
    };
}