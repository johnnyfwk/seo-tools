// import * as cheerio from 'cheerio';
// import { scrapeCanonicalTags } from './canonicalTags';
// import { checkRobotsTxt } from './robotsTxt';
// import { scrapeMetaRobotsTag } from './metaRobotsTag';
// import * as utils from '@/app/lib/utils/utils';

// // HEAD -> GET fallback for internal links
// async function fetchRedirectInfoWithHeadFallback(url) {
//     const redirectChain = [];
//     const MAX_REDIRECTS = 10;
//     let currentUrl = url;

//     for (let i = 0; i < MAX_REDIRECTS; i++) {
//         try {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 5000);

//             // Try HEAD first
//             let res = await fetch(currentUrl, {
//                 method: 'HEAD',
//                 redirect: 'manual',
//                 headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' },
//                 signal: controller.signal,
//             });
//             clearTimeout(timeoutId);

//             // Fallback to GET if HEAD fails or is not allowed
//             if ([0, 405, 501].includes(res.status)) {
//                 const getController = new AbortController();
//                 const getTimeout = setTimeout(() => getController.abort(), 5000);

//                 res = await fetch(currentUrl, {
//                     method: 'GET',
//                     redirect: 'manual',
//                     headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' },
//                     signal: getController.signal,
//                 });
//                 clearTimeout(getTimeout);
//             }

//             redirectChain.push({ url: currentUrl, statusCode: res.status });

//             const location = res.headers.get('location');
//             if (location) {
//                 currentUrl = new URL(location, currentUrl).href;
//             } else {
//                 return {
//                     redirectChain,
//                     enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
//                     finalUrl: currentUrl,
//                     finalUrlStatusCode: res.status,
//                     fetchError: null,
//                 };
//             }
//         } catch (err) {
//             redirectChain.push({ url: currentUrl, statusCode: null, fetchError: err.message });
//             return {
//                 redirectChain,
//                 enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
//                 finalUrl: currentUrl,
//                 finalUrlStatusCode: null,
//                 fetchError: err.message,
//             };
//         }
//     }

//     return {
//         redirectChain,
//         enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
//         finalUrl: currentUrl,
//         finalUrlStatusCode: redirectChain[redirectChain.length - 1]?.statusCode ?? null,
//         fetchError: null,
//     };
// }

// // External links (HEAD only)
// async function fetchExternalRedirectInfo(url) {
//     const redirectChain = [];
//     const MAX_REDIRECTS = 10;
//     let currentUrl = url;

//     for (let i = 0; i < MAX_REDIRECTS; i++) {
//         try {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 5000);

//             const res = await fetch(currentUrl, {
//                 method: 'HEAD',
//                 redirect: 'manual',
//                 headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' },
//                 signal: controller.signal,
//             });
//             clearTimeout(timeoutId);

//             redirectChain.push({ url: currentUrl, statusCode: res.status });

//             const location = res.headers.get('location');
//             if (location) {
//                 currentUrl = new URL(location, currentUrl).href;
//             } else {
//                 return {
//                     redirectChain,
//                     enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
//                     finalUrl: currentUrl,
//                     finalUrlStatusCode: res.status,
//                     fetchError: null,
//                 };
//             }
//         } catch (err) {
//             redirectChain.push({ url: currentUrl, statusCode: null, fetchError: err.message });
//             return {
//                 redirectChain,
//                 enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
//                 finalUrl: currentUrl,
//                 finalUrlStatusCode: null,
//                 fetchError: err.message,
//             };
//         }
//     }

//     return {
//         redirectChain,
//         enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
//         finalUrl: currentUrl,
//         finalUrlStatusCode: redirectChain[redirectChain.length - 1]?.statusCode ?? null,
//         fetchError: null,
//     };
// }

// export async function scrapeLinks($, pageUrl) {
//     const limit = utils.createLimiter(10);
//     const base = new URL(pageUrl);

//     // Extract links
//     const links = $('a[href]')
//         .map((i, el) => {
//             const href = $(el).attr('href');
//             if (!href) return null;

//             const anchorText = $(el).text();
//             const isImageHref = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href);

//             const innerImg = $(el).find('img').first();
//             const innerImgSrcRaw = innerImg.attr('src');
//             const innerImgAlt = innerImg.attr('alt') || "Image link";

//             let resolvedHref, resolvedImgSrc = null;

//             try { resolvedHref = new URL(href, base).href; } catch { resolvedHref = href; }

//             if (innerImgSrcRaw) {
//                 try {
//                     const linkBase = new URL(href, base);
//                     resolvedImgSrc = new URL(innerImgSrcRaw, linkBase).href;
//                 } catch { resolvedImgSrc = innerImgSrcRaw; }
//             }

//             let anchor;
//             if (resolvedImgSrc) {
//                 anchor = { type: 'Image', src: resolvedImgSrc, alt: innerImgAlt };
//             } else if (isImageHref) {
//                 anchor = { type: 'Image', src: resolvedHref, alt: innerImgAlt };
//             } else if (anchorText) {
//                 anchor = { type: 'Text', text: anchorText };
//             } else {
//                 anchor = { type: 'Text', text: "(no text)" };
//             }

//             return { url: resolvedHref, anchor };
//         })
//         .get()
//         .filter(Boolean);

//     // Separate internal vs external
//     const normalizeHost = h => h.replace(/^www\./, '').toLowerCase();
//     const baseHost = normalizeHost(base.hostname);

//     const internalLinks = [];
//     const externalLinks = [];

//     links.forEach(link => {
//         try {
//             const host = normalizeHost(new URL(link.url).hostname);
//             if (host === baseHost || host.endsWith(`.${baseHost}`)) {
//                 internalLinks.push(link);
//             } else {
//                 externalLinks.push(link);
//             }
//         } catch {}
//     });

//     // Caches
//     const robotsCache = new Map();
//     const canonicalCache = new Map();

//     async function cachedCheckRobotsTxt(url, agent) {
//         try {
//             const origin = new URL(url).origin;
//             if (!robotsCache.has(origin)) {
//                 const result = await checkRobotsTxt(url, agent);
//                 robotsCache.set(origin, result);
//             }
//             return robotsCache.get(origin);
//         } catch (err) {
//             // Default allow if robots.txt fails to fetch
//             return { allowed: true, reason: `Robots fetch error: ${err.message}` };
//         }
//     }

//     async function fetchHtmlAndMeta(url) {
//         const origin = new URL(url).origin;

//         if (canonicalCache.has(url) && robotsCache.has(origin)) {
//             const cachedCanonical = canonicalCache.get(url);
//             return {
//                 canonicalUrl: cachedCanonical.resolvedUrl,
//                 isNoindex: !robotsCache.get(origin).allowed,
//                 robotsTxtCheck: robotsCache.get(origin),
//                 matchesFirstCanonicalTag: cachedCanonical.resolvedUrlMatchesOriginalUrl,
//                 fetchError: null,
//             };
//         }

//         let canonicalUrl = url;
//         let isNoindex = false;
//         let robotsTxtCheck = { allowed: true, reason: 'Default allow' };
//         let matchesFirstCanonicalTag = null;
//         let fetchError = null;

//         try {
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 5000);

//             const res = await fetch(url, {
//                 headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' },
//                 signal: controller.signal,
//             });
//             clearTimeout(timeoutId);

//             if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) {
//                 fetchError = `Non-HTML or bad status: ${res.status}`;
//             } else {
//                 const html = await res.text();
//                 const $page = cheerio.load(html);

//                 const canonicalData = await scrapeCanonicalTags($page, url);
//                 const firstCanonical = canonicalData.canonicalTags[0];

//                 if (firstCanonical) {
//                     canonicalUrl = firstCanonical.resolvedUrl || url;
//                     matchesFirstCanonicalTag = firstCanonical.resolvedUrlMatchesOriginalUrl;
//                 }

//                 const metaRobots = scrapeMetaRobotsTag($page);
//                 if (!metaRobots.metaRobotsTag.allowsIndexing) isNoindex = true;
//             }

//             robotsTxtCheck = await cachedCheckRobotsTxt(url, '*');

//             canonicalCache.set(url, {
//                 resolvedUrl: canonicalUrl,
//                 resolvedUrlMatchesOriginalUrl: matchesFirstCanonicalTag,
//             });
//         } catch (err) {
//             fetchError = err.message;
//             robotsTxtCheck = await cachedCheckRobotsTxt(url, '*'); // fallback to robots
//         }

//         return {
//             canonicalUrl,
//             isNoindex,
//             robotsTxtCheck,
//             matchesFirstCanonicalTag,
//             fetchError
//         };
//     }

//     async function processLink(link, internal = true) {
//         let redirectInfo;
//         try {
//             redirectInfo = internal
//                 ? await fetchRedirectInfoWithHeadFallback(link.url)
//                 : await fetchExternalRedirectInfo(link.url);
//         } catch (err) {
//             redirectInfo = {
//                 redirectChain: [],
//                 finalUrl: link.url,
//                 finalUrlStatusCode: null,
//                 enteredUrlStatusCode: null,
//                 fetchError: err.message,
//             };
//         }

//         const enteredUrlStatus = redirectInfo.enteredUrlStatusCode;
//         const isRedirected = redirectInfo.finalUrl !== link.url;

//         let canonicalUrl = link.url;
//         let isNoindex = false;
//         let robotsTxtCheck = { allowed: true, reason: 'Default allow' };
//         let matchesFirstCanonicalTag = null;

//         if (internal && enteredUrlStatus === 200 && !isRedirected) {
//             const metaData = await fetchHtmlAndMeta(link.url);
//             canonicalUrl = metaData.canonicalUrl;
//             isNoindex = metaData.isNoindex;
//             robotsTxtCheck = metaData.robotsTxtCheck;
//             matchesFirstCanonicalTag = metaData.matchesFirstCanonicalTag;
//         }

//         return {
//             ...link,
//             internal,
//             statusCode: enteredUrlStatus,
//             finalUrl: redirectInfo.finalUrl,
//             finalUrlStatusCode: redirectInfo.finalUrlStatusCode,
//             redirectChain: redirectInfo.redirectChain,
//             canonicalUrl,
//             isNoindex,
//             robotsTxtCheck,
//             matchesFirstCanonicalTag,
//             isIndexable: internal
//                 ? enteredUrlStatus === 200 && !isRedirected && !isNoindex && robotsTxtCheck.allowed
//                 : undefined,
//             fetchError: redirectInfo.fetchError,
//         };
//     }

//     const allLinks = [
//         ...internalLinks,
//         ...externalLinks.map(l => ({ ...l, internal: false })),
//     ];

//     const processedLinks = await Promise.all(
//         allLinks.map(link => limit(() => processLink(link, link.internal)))
//     );

//     return {
//         links: {
//             internal: processedLinks.filter(l => l.internal),
//             external: processedLinks.filter(l => !l.internal),
//         },
//     };
// }


import cheerio from "cheerio";
import * as utils from "@/app/lib/utils/utils";

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

        // Fetch the URL to get status codes and redirect info
        let statusCode = null;
        let finalUrl = null;
        let finalStatusCode = null;

        try {
            const res = await fetch(resolvedUrl, {
                method: "GET",
                redirect: "follow", // automatically follow redirects
            });
            statusCode = res.status;
            finalUrl = res.url;
            finalStatusCode = res.status;
        } catch (err) {
            console.warn(`Failed to fetch ${resolvedUrl}: ${err.message}`);
        }

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
