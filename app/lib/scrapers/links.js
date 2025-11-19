import * as cheerio from "cheerio";
import { browserHeaders } from "../utils/browserHeaders";

/**
 * Scrapes links from HTML and fetches HTTP info
 * @param {string|function} htmlOr$ - raw HTML or a cheerio instance
 * @param {string} pageUrl - the base URL of the page
 */
export async function scrapeLinks(htmlOr$, pageUrl) {
    const $ = typeof htmlOr$ === "function" && htmlOr$.root
        ? htmlOr$
        : cheerio.load(htmlOr$);

    const pageOrigin = new URL(pageUrl).origin;

    async function processLink(el) {
        const rawHref = $(el).attr("href") || null;
        if (!rawHref) return null;

        const cleanHref = rawHref.trim();

        // Detect JS/click-tracking links
        const uncrawlable =
            cleanHref === "" ||
            cleanHref === "#" ||
            cleanHref.startsWith("javascript:") ||
            cleanHref.startsWith("tel:") ||
            cleanHref.startsWith("mailto:");

        // URL resolution
        let resolvedUrl;
        try {
            resolvedUrl = new URL(cleanHref, pageUrl).href;
        } catch {
            resolvedUrl = cleanHref;
        }

        const isInternal = resolvedUrl.startsWith(pageOrigin);
        const type = classifyLink($, el, uncrawlable);
        const anchorText = extractAnchorText($, el);
        const imageSrc = extractImagePreview($, el, pageUrl);
        const imageAlt = type === "image" ? ($(el).find("img").attr("alt") || null) : null;

        // Extract rel attributes (nofollow, ugc, sponsored, noopener, noreferrer)
        const rel = ($(el).attr("rel") || "").split(/\s+/).filter(Boolean);
        const relInfo = {
            rel: rel.length ? rel.join(" ") : null,
            nofollow: rel.includes("nofollow"),
            ugc: rel.includes("ugc"),
            sponsored: rel.includes("sponsored"),
            noopener: rel.includes("noopener"),
            noreferrer: rel.includes("noreferrer")
        };

        // Check broken image preview
        let imageStatus = null;
        if (imageSrc) {
            try {
                const imgRes = await fetch(imageSrc);
                imageStatus = imgRes.status;
            } catch {
                imageStatus = "error";
            }
        }

        let statusCode = null;
        let finalUrl = resolvedUrl;

        if (!uncrawlable) {
            const { statusCode: s, finalUrl: f } = await getStatusWithRedirects(resolvedUrl);
            statusCode = s;
            finalUrl = f;
        }

        return {
            rawHref,
            cleanHref,
            url: resolvedUrl,

            type,
            anchorText,
            imageSrc,
            imageAlt,
            imageStatus,

            internal: isInternal,
            uncrawlable,

            ...relInfo,

            statusCode,
            finalUrl,
        };
    }

    const linkElements = $("a").toArray();

    const processed = (await Promise.all(
        linkElements.map(processLink)
    )).filter(Boolean);

    return {
        links: {
            internal: processed.filter(l => l?.internal === true),
            external: processed.filter(l => l?.internal === false),
            uncrawlable: processed.filter(l => l?.uncrawlable === true)
        },
    };
}

/* -------------------- HELPERS -------------------- */

async function getStatusWithRedirects(url, maxRedirects = 5) {
    let currentUrl = url;
    let lastStatus = null;

    for (let i = 0; i < maxRedirects; i++) {
        try {
            // Try HEAD first
            let res = await fetch(currentUrl, {
                method: "HEAD",
                headers: browserHeaders,
                redirect: "manual"
            });

            // If HEAD is not allowed, fallback to GET
            if (res.status === 405 || res.status === 501) {
                res = await fetch(currentUrl, {
                    method: "GET",
                    headers: browserHeaders,
                    redirect: "manual"
                });
            }

            lastStatus = res.status;

            if ([301,302,303,307,308].includes(res.status)) {
                const loc = res.headers.get("location");
                if (!loc) break;
                currentUrl = new URL(loc, currentUrl).href;
                continue;
            }

            return { statusCode: res.status, finalUrl: currentUrl };
        } catch {
            return { statusCode: null, finalUrl: currentUrl };
        }
    }

    return { statusCode: lastStatus, finalUrl: currentUrl };
}

function classifyLink($, el, uncrawlable) {
    if (uncrawlable) return "uncrawlable";

    if ($(el).find("img").length > 0) return "image";

    const text = $(el).text().trim();
    if (text !== "") return "text";

    return "other";
}

function extractAnchorText($, el) {
    const img = $(el).find("img").first();
    if (img.length) {
        const alt = img.attr("alt");
        return alt && alt.trim() !== "" ? alt : "(image link)";
    }

    const text = $(el).text();
    if (text.trim() !== "") return text;

    const aria = $(el).attr("aria-label");
    if (aria) return aria;

    const title = $(el).attr("title");
    if (title) return title;

    const svgTitle = $(el).find("svg title").text();
    if (svgTitle) return svgTitle;

    return "(no text)";
}

function extractImagePreview($, el, pageUrl) {
    const img = $(el).find("img").first();
    if (!img.length) return null;

    const src =
        img.attr("src") ||
        img.attr("data-src") ||
        img.attr("data-lazy-src") ||
        img.attr("data-original");

    if (!src) return null;

    try {
        return new URL(src, pageUrl).href;
    } catch {
        return src;
    }
}
