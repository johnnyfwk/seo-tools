import * as cheerio from 'cheerio';
import { fetchRedirectInfo } from '../utils/fetchRedirectInfo';
import { scrapeCanonicalUrl } from './canonicalUrl';
import { checkRobotsTxt } from './robotsTxt';
import { scrapeMetaRobotsTag } from './metaRobotsTag';
import * as utils from '@/app/lib/utils/utils';

export async function scrapeLinks($, pageUrl) {
    const limit = utils.createLimiter(5);

    const base = new URL(pageUrl);

    // Extract all <a> tags
    const links = $('a[href]')
        .map((i, el) => {
            const href = $(el).attr('href');
            if (!href) return null;

            const anchorText = $(el).text().trim();
            const isImageHref = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href);

            const innerImg = $(el).find('img').first();
            const innerImgSrcRaw = innerImg.attr('src');
            const innerImgAlt = innerImg.attr('alt') || "Image link";

            let resolvedHref, resolvedImgSrc = null;

            try { resolvedHref = new URL(href, base).href; } catch { resolvedHref = href; }

            if (innerImgSrcRaw) {
                try {
                    // Resolve relative to the link itself if href is absolute
                    const linkBase = new URL(href, base);
                    resolvedImgSrc = new URL(innerImgSrcRaw, linkBase).href;
                } catch {
                    resolvedImgSrc = innerImgSrcRaw;
                }
            }

            // Determine anchor to display
            let anchor;
            if (resolvedImgSrc) {
                anchor = { type: 'Image', src: resolvedImgSrc, alt: innerImgAlt };
            } else if (isImageHref) {
                anchor = { type: 'Image', src: resolvedHref, alt: innerImgAlt };
            } else if (anchorText) {
                anchor = { type: 'Text', text: anchorText };
            } else {
                anchor = { type: 'Text', text: "(no text)" };
            }

            return { url: resolvedHref, anchor };
        })
        .get()
        .filter(Boolean);

    // Separate internal and external links
    const normalizeHost = h => h.replace(/^www\./, '').toLowerCase();
    const baseHost = normalizeHost(base.hostname);

    const internalLinks = [];
    const externalLinks = [];

    links.forEach(link => {
        try {
            const host = normalizeHost(new URL(link.url).hostname);
            if (host === baseHost || host.endsWith(`.${baseHost}`)) {
                internalLinks.push(link);
            } else {
                externalLinks.push(link);
            }
        } catch {
            // skip invalid urls
        }
    });

    async function fetchHtmlPage(url) {
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' } });
            if (!res.ok) return null;
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('text/html')) return null;
            const html = await res.text();
            return cheerio.load(html);
        } catch {
            return null;
        }
    }

    // Process internal links (full SEO info)
    async function processInternal(links) {
        return Promise.all(
            links.map(link =>
                limit(async () => {
                    let redirectInfo;

                    try {
                        redirectInfo = await fetchRedirectInfo(link.url);
                    } catch (err) {
                        console.warn(`Failed to fetch ${link.url}:`, err.message);
                        redirectInfo = {
                            redirectChain: [],
                            finalUrl: link.url,
                            finalUrlStatusCode: null,
                            enteredUrlStatusCode: null,
                            httpRedirectsToHttps: null,
                            enteredUrlFetchError: err.message,
                            finalUrlFetchError: err.message,
                        };
                    }

                    const enteredUrlStatus = redirectInfo.enteredUrlStatusCode;
                    const isRedirected = redirectInfo.finalUrl !== link.url;

                    let isNoindex = false;
                    let canonicalUrl = link.url;
                    let robotsTxtCheck = { allowed: true, reason: 'Default allow' };

                    if (enteredUrlStatus === 200 && !isRedirected) {
                        const $page = await fetchHtmlPage(link.url);
                        if ($page) {
                            canonicalUrl = scrapeCanonicalUrl($page).canonicalUrl || link.url;
                            const metaRobots = scrapeMetaRobotsTag($page);
                            if (!metaRobots.metaRobotsTag.allowsIndexing) isNoindex = true;
                        }
                        try { robotsTxtCheck = await checkRobotsTxt(link.url, '*'); } catch {}
                    }

                    return {
                        ...link,
                        statusCode: enteredUrlStatus,
                        finalUrl: redirectInfo.finalUrl,
                        finalUrlStatusCode: redirectInfo.finalUrlStatusCode,
                        redirectChain: redirectInfo.redirectChain,
                        httpRedirectsToHttps: redirectInfo.httpRedirectsToHttps,
                        canonicalUrl,
                        isNoindex,
                        robotsTxtCheck,
                        isIndexable: enteredUrlStatus === 200 && !isRedirected && !isNoindex && robotsTxtCheck.allowed,
                        fetchError: redirectInfo.finalUrlFetchError,
                    };
                })
            )
        );
    }

    // Process external links (lightweight)
    async function processExternal(links) {
        return Promise.all(
            links.map(link =>
                limit(async () => {
                    let enteredStatus = null;
                    let finalUrlStatus = null;
                    let finalUrl = link.url;
                    let redirectChain = [];
                    let fetchError = null;

                    try {
                        let currentUrl = link.url;
                        const MAX_REDIRECTS = 10;

                        for (let i = 0; i < MAX_REDIRECTS; i++) {
                            const res = await Promise.race([
                                fetch(currentUrl, {
                                    method: 'HEAD',
                                    redirect: 'manual',
                                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' },
                                }),
                                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000)) // 10s timeout
                            ]);

                            if (i === 0) enteredStatus = res.status;
                            redirectChain.push({ url: currentUrl, statusCode: res.status });

                            const location = res.headers.get('location');
                            if (location) {
                                currentUrl = new URL(location, currentUrl).href;
                            } else {
                                finalUrl = currentUrl;
                                finalUrlStatus = res.status;
                                break;
                            }
                        }

                        if (!finalUrlStatus) {
                            finalUrlStatus = enteredStatus;
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch ${link.url}:`, err.message);
                        fetchError = err.message;
                        finalUrlStatus = null;
                    }

                    return {
                        url: link.url,
                        anchor: link.anchor,
                        statusCode: enteredStatus,
                        finalUrl,
                        finalUrlStatusCode: finalUrlStatus,
                        redirectChain,
                        fetchError
                    };
                })
            )
        );
    }

    const [processedInternal, processedExternal] = await Promise.all([
        processInternal(internalLinks),
        processExternal(externalLinks),
    ]);

    return {
        links: {
            internal: processedInternal,
            external: processedExternal
        },
    };
}
