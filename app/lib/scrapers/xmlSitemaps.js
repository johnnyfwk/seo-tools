import { DOMParser } from "@xmldom/xmldom";
import zlib from "zlib";
import { checkRobotsTxt } from "../utils/checkRobotsTxt";

// Small concurrency limiter (3 at a time)
function queue(items, limit, worker) {
    const running = new Set();

    return new Promise((resolve) => {
        let index = 0;

        function next() {
            if (index >= items.length && running.size === 0) {
                resolve();
                return;
            }
            while (running.size < limit && index < items.length) {
                const item = items[index++];
                const p = worker(item).finally(() => {
                    running.delete(p);
                    next();
                });
                running.add(p);
            }
        }

        next();
    });
}

export async function scrapeXmlSitemaps(targetUrl) {
    const robotsData = await checkRobotsTxt(targetUrl);
    const sitemapRoots = robotsData.sitemaps.length
        ? robotsData.sitemaps
        : [new URL("/sitemap.xml", targetUrl).href];

    const foundSitemaps = [];       // keep duplicates
    const foundMatchIn = new Set(); // deduplicate matches

    const normalizeUrl = (u) => u.replace(/\/$/, "").toLowerCase();

    async function fetchXml(url) {
        try {
            const res = await fetch(url, {
                redirect: "follow",
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; MySEOChecker/1.0)",
                    "Accept": "application/xml,text/xml,*/*;q=0.8"
                }
            });

            if (!res.ok) {
                console.warn(`❌ Non-OK HTTP response for ${url}: ${res.status}`);
                return null;
            }

            const buf = Buffer.from(await res.arrayBuffer());

            let xmlString;
            try {
                xmlString = zlib.gunzipSync(buf).toString("utf-8");
            } catch {
                try {
                    xmlString = zlib.inflateSync(buf).toString("utf-8");
                } catch {
                    xmlString = buf.toString("utf-8");
                }
            }

            return new DOMParser().parseFromString(xmlString, "application/xml");
        } catch (err) {
            console.warn(`❌ Error fetching sitemap ${url}:`, err.message);
            return null;
        }
    }

    function extractLocs(xmlDoc) {
        const nodes = xmlDoc.getElementsByTagName("loc");
        const locs = new Array(nodes.length);
        for (let i = 0; i < nodes.length; i++) {
            locs[i] = nodes[i].textContent?.trim();
        }
        return locs.filter(Boolean);
    }

    async function processSitemap(url) {
        foundSitemaps.push(url); // keep duplicates for display

        const xmlDoc = await fetchXml(url);
        if (!xmlDoc) return;

        const locs = extractLocs(xmlDoc);
        const normTarget = normalizeUrl(targetUrl);

        for (const loc of locs) {
            if (normalizeUrl(loc) === normTarget) {
                foundMatchIn.add(url); // deduplicate matches
            }
        }
    }

    await queue(sitemapRoots, 3, processSitemap);

    return {
        hasSitemap: foundSitemaps.length > 0,
        robotsTxtChecked: robotsData.url,
        sitemapsChecked: foundSitemaps,            // duplicates preserved
        urlFound: foundMatchIn.size > 0,
        sitemapsContainingUrl: Array.from(foundMatchIn), // unique matches only
    };
}
