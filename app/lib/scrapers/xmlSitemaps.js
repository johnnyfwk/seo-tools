import { DOMParser } from '@xmldom/xmldom';
import zlib from 'zlib';

import { checkRobotsTxt } from '../utils/checkRobotsTxt';

export async function scrapeXmlSitemaps(targetUrl) {
    const robotsData = await checkRobotsTxt(targetUrl);

    const sitemapRoots = robotsData.sitemaps.length
        ? robotsData.sitemaps
        : [new URL('/sitemap.xml', targetUrl).href];

    const foundSitemaps = new Set();
    const foundMatchIn = new Set();

    async function fetchXml(url) {
        try {
            const res = await fetch(url, {
                headers: { 'User-Agent': "Mozilla/5.0 (compatible; MySEOChecker/1.0)" }
            });

            if (!res.ok) return null;

            const buf = Buffer.from(await res.arrayBuffer());

            let xmlString;

            // Check gzip by magic number
            if (buf[0] === 0x1f && buf[1] === 0x8b) {
                xmlString = zlib.gunzipSync(buf).toString('utf-8');
            } else {
                xmlString = buf.toString('utf-8');
            }

            return new DOMParser().parseFromString(xmlString, 'application/xml');
        } catch (err) {
            console.warn(`❌ Failed to fetch sitemap ${url}:`, err.message);
            return null;
        }
    }

    function extractLocs(xmlDoc) {
        const locs = [];

        const locEls = xmlDoc.getElementsByTagName('loc');
        for (let i = 0; i < locEls.length; i++) {
            const text = locEls[i].textContent?.trim();
            if (text) locs.push(text);
        }

        return locs;
    }

    async function processSitemap(url) {
        const xmlDoc = await fetchXml(url);
        if (!xmlDoc) return;

        foundSitemaps.add(url);

        const locs = extractLocs(xmlDoc);

        // Check if this is a sitemap index
        const isIndex = xmlDoc.getElementsByTagName('sitemap').length > 0;

        if (isIndex) {
            // ❌ Don't fetch child sitemaps
            return;
        }

        // Normal URLset
        for (const loc of locs) {
            if (normalizeUrl(loc) === normalizeUrl(targetUrl)) {
                foundMatchIn.add(url);
            }
        }
    }

    const normalizeUrl = (u) => u.replace(/\/$/, '').toLowerCase();

    // Process only top-level sitemaps from robots.txt
    await Promise.all(sitemapRoots.map(processSitemap));

    return {
        xmlSitemaps: {
            hasSitemap: foundSitemaps.size > 0,
            robotsTxtChecked: robotsData.url,
            sitemapsChecked: Array.from(foundSitemaps),
            urlFound: foundMatchIn.size > 0,
            sitemapsContainingUrl: Array.from(foundMatchIn),
        }
    };
}