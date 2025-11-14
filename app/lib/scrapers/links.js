import cheerio from "cheerio";
import { fetchRedirectInfo } from "../utils/fetchRedirectInfo";

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
        const href = $(el).attr("href")?.trim();
        if (!href) return null;

        let resolvedUrl;
        try {
            resolvedUrl = new URL(href, pageUrl).href;
        } catch {
            resolvedUrl = href;
        }

        const isInternal = resolvedUrl.startsWith(pageOrigin);
        const type = classifyLink($, el);
        const anchorText = extractAnchorText($, el);
        const imageSrc = extractImagePreview($, el, pageUrl);
        const imageAlt = type === "image" ? $(el).find("img").attr("alt") || null : null;

        let redirectInfo;
        try {
            redirectInfo = await fetchRedirectInfo(resolvedUrl);
        } catch (err) {
            redirectInfo = {
                redirectChain: [],
                enteredUrlStatusCode: null,
                finalUrlStatusCode: null,
                enteredUrlFetchError: err.message,
                finalUrlFetchError: err.message,
                finalUrl: resolvedUrl,
                httpRedirectsToHttps: null,
            };
        }

        const statusCode = redirectInfo.enteredUrlStatusCode;
        const finalUrl = redirectInfo.finalUrl;
        const finalStatusCode = redirectInfo.finalUrlStatusCode;
        const redirectChain = redirectInfo.redirectChain;
        const httpRedirectsToHttps = redirectInfo.httpRedirectsToHttps;

        return {
            url: resolvedUrl,
            type,
            anchorText,
            internal: isInternal,
            imageSrc,
            imageAlt,
            statusCode,
            finalUrl,
            finalStatusCode,
            redirectChain,
            httpRedirectsToHttps,
            enteredUrlFetchError: redirectInfo.enteredUrlFetchError,
            finalUrlFetchError: redirectInfo.finalUrlFetchError,
        };
    }

    const processed = await Promise.all(
        $("a").toArray().map(processLink)
    );

    return {
        links: {
            internal: processed.filter(l => l?.internal === true),
            external: processed.filter(l => l?.internal === false),
        },
    };
}

/* -------------------- HELPERS -------------------- */

function classifyLink($, el) {
    if ($(el).find("img").length > 0) return "Image";
    if ($(el).text().trim()) return "Text";
    return "Other";
}

function extractAnchorText($, el) {
    const text = $(el).text().trim();
    if (text) return text;

    const imgAlt = $(el).find("img").attr("alt");
    if (imgAlt) return imgAlt;

    const aria = $(el).attr("aria-label");
    if (aria) return aria.trim();

    const title = $(el).attr("title");
    if (title) return title.trim();

    const svgTitle = $(el).find("svg title").text();
    if (svgTitle) return svgTitle;

    return null;
}

function extractImagePreview($, el, pageUrl) {
    const img = $(el).find("img").first();
    if (!img.length) return null;

    let src = img.attr("src") || img.attr("data-src");
    if (!src) return null;

    try {
        return new URL(src, pageUrl).href;
    } catch {
        return src;
    }
}
