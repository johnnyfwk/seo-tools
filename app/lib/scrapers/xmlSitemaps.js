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

    // Either robots.txt sitemaps or fallback to /sitemap.xml
    const sitemapRoots = robotsData.sitemaps.length
        ? robotsData.sitemaps.map(s => s.url)
        : [new URL("/sitemap.xml", targetUrl).href];

    const foundSitemaps = [];       // duplicates preserved
    const foundMatchIn = new Map(); // map sitemapURL -> sitemapObj (unique)

    const normalizeUrl = (u) => u.replace(/\/$/, "").toLowerCase();

    async function fetchXmlWithStatus(url) {
        try {
            const res = await fetch(url, {
                redirect: "follow",
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; MySEOChecker/1.0)",
                    "Accept": "application/xml,text/xml,*/*;q=0.8"
                }
            });

            const statusCode = res.status;

            // Only 200 counts as success
            if (statusCode !== 200) {
                return { xml: null, statusCode };
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

            return {
                xml: new DOMParser().parseFromString(xmlString, "application/xml"),
                statusCode
            };

        } catch (err) {
            return { xml: null, statusCode: null, error: err.message };
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
        const result = await fetchXmlWithStatus(url);

        // Save every attempt (for display/logging)
        const sitemapRecord = {
            url,
            statusCode: result.statusCode
        };
        foundSitemaps.push(sitemapRecord);

        if (!result.xml) return;

        const locs = extractLocs(result.xml);
        const normTarget = normalizeUrl(targetUrl);

        for (const loc of locs) {
            if (normalizeUrl(loc) === normTarget) {
                // save unique match
                foundMatchIn.set(url, sitemapRecord);
            }
        }
    }

    await queue(sitemapRoots, 3, processSitemap);

    // Only consider sitemaps with statusCode 200 as "real"
    const successfulSitemaps = foundSitemaps.filter(s => s.statusCode === 200);

    return {
        hasSitemap: successfulSitemaps.length > 0,
        robotsTxtChecked: robotsData.url,
        sitemapsChecked: foundSitemaps,            // duplicates preserved
        urlFound: foundMatchIn.size > 0,
        sitemapsContainingUrl: Array.from(foundMatchIn.values())
    };
}
