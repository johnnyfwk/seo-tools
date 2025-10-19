// import * as cheerio from 'cheerio';
// import { scrapeCanonical } from './canonical';
// import { checkRobotsTxt } from './robotsTxt';

// export async function scrapePageLinks($, pageUrl) {
//     // Resolve relative URLs to absolute
//     const base = new URL(pageUrl);

//     const links = $('a[href]')
//         .map((i, element) => {
//             const href = $(element).attr('href');
//             const anchorText = $(element).text().trim();

//             // Skip if no href
//             if (!href) return null;

//             // Detect if link is an image file
//             const isImageHref = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href);

//             // Detect if the <a> contains an <img>
//             const innerImg = $(element).find('img').first();
//             const innerImgSrcRaw = innerImg.attr('src');
//             const innerImgAlt = innerImg.attr('alt') || "Image link";

//             let resolvedHref, resolvedImgSrc = null;

//             try {
//                 resolvedHref = new URL(href, base).href;
//             } catch {
//                 resolvedHref = href;
//             }

//             if (innerImgSrcRaw) {
//                 try {
//                     // Resolve relative to the link itself if href is absolute
//                     const linkBase = new URL(href, base);
//                     resolvedImgSrc = new URL(innerImgSrcRaw, linkBase).href;
//                 } catch {
//                     resolvedImgSrc = innerImgSrcRaw;
//                 }
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

//             return { href: resolvedHref, anchor };
//         })
//         .get()
//         .filter(Boolean);

//     // Resolve relative URLs to absolute
//     const resolvedLinks = links.map(link => {
//         try {
//             const url = new URL(link.href, base);
//             return { url: url.href, anchor: link.anchor };
//         } catch {
//             return null; // skip invalid URLs
//         }
//     }).filter(Boolean);

//     // ✅ Separate internal and external links
//     const normalizeHostname = (hostname) => hostname.replace(/^www\./, '').toLowerCase();
//     const baseHost = normalizeHostname(base.hostname);

//     const internalLinks = resolvedLinks.filter(link => {
//         try {
//             const host = normalizeHostname(new URL(link.url).hostname);
//             return host === baseHost || host.endsWith(`.${baseHost}`);
//         } catch {
//             return false;
//         }
//     });

//     const externalLinks = resolvedLinks.filter(link => {
//         try {
//             const host = normalizeHostname(new URL(link.url).hostname);
//             return !(host === baseHost || host.endsWith(`.${baseHost}`));
//         } catch {
//             return false;
//         }
//     });

//     // Helper function to follow redirects manually and build the chain
//     async function fetchWithRedirectChain(url) {
//         const chain = [];
//         let currentUrl = url;
//         const MAX_REDIRECTS = 10; // prevent infinite loops

//         for (let i = 0; i < MAX_REDIRECTS && currentUrl; i++) {
//             try {
//                 const response = await fetch(currentUrl, {
//                     method: 'HEAD',
//                     redirect: 'manual',
//                     headers: {
//                         'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0; +https://yourdomain.com)',
//                     },
//                 });

//                 const statusCode = response.status;
//                 chain.push({ url: currentUrl, statusCode });

//                 const location = response.headers.get('location');
//                 if (location) {
//                     currentUrl = new URL(location, currentUrl).href;
//                 } else {
//                     currentUrl = null;
//                 }
//             } catch (err) {
//                 chain.push({ url: currentUrl, statusCode: "Fetch failed" });
//                 break;
//             }
//         }

//         return chain;
//     }

//     // Fetch status code and final URL for each link
//     async function processLinks(links) {
//         return Promise.all(
//             links.map(async link => {
//                 const redirectChain = await fetchWithRedirectChain(link.url);
//                 const finalUrl = redirectChain[redirectChain.length - 1]?.url || link.url;
//                 const statusCode = redirectChain[0]?.statusCode || null;

//                 let isNoindex = false;
//                 let canonicalUrl = link.url;
//                 let robotsTxtCheck = { allowed: true };

//                 try {
//                     const res = await fetch(link.url, {
//                         headers: {
//                             'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0; +https://yourdomain.com)',
//                         },
//                         redirect: 'manual',
//                     });

//                     const contentType = res.headers.get('content-type') || '';
//                     const xRobotsTag = res.headers.get('x-robots-tag') || '';

//                     if (xRobotsTag.toLowerCase().includes('noindex')) {
//                         isNoindex = true;
//                     }

//                     if (contentType.includes('text/html')) {
//                         const html = await res.text();
//                         const $page = cheerio.load(html);

//                         canonicalUrl = scrapeCanonical($page).canonicalUrl || link.url;

//                         const metaRobots = $page('meta[name="robots"]').attr('content') || '';
//                         if (metaRobots.toLowerCase().includes('noindex')) {
//                             isNoindex = true;
//                         }
//                     }

//                     robotsTxtCheck = await checkRobotsTxt(link.url, '*');

//                 } catch (err) {
//                     console.error(`Error fetching ${link.url}: ${err.message}`);
//                     robotsTxtCheck = { allowed: false };
//                 }

//                 const isIndexable =
//                     statusCode === 200 &&
//                     !isNoindex &&
//                     robotsTxtCheck.allowed;

//                 return {
//                     ...link,
//                     statusCode,
//                     finalUrl,
//                     redirectChain,
//                     canonicalUrl,
//                     isNoindex,
//                     robotsTxtCheck,
//                     isIndexable,
//                 };
//             })
//         );
//     }

//     // Process internal and external separately (if needed)
//     const [processedInternal, processedExternal] = await Promise.all([
//         processLinks(internalLinks),
//         processLinks(externalLinks),
//     ]);

//     // Return both sets clearly
//     return {
//         internalLinks: processedInternal,
//         externalLinks: processedExternal,
//     };
// }

import * as cheerio from 'cheerio';
import { scrapeCanonical } from './canonical';
import { checkRobotsTxt } from './robotsTxt';

export async function scrapePageLinks($, pageUrl) {
    const base = new URL(pageUrl);

    // Extract all <a> tags
    const links = $('a[href]')
        .map((i, el) => {
            const href = $(el).attr('href');
            const anchorText = $(el).text().trim();

            if (!href) return null;

            // Detect if link is an image file
            const isImageHref = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href);

            // Detect if the <a> contains an <img>
            const innerImg = $(el).find('img').first();
            const innerImgSrcRaw = innerImg.attr('src');
            const innerImgAlt = innerImg.attr('alt') || "Image link";

            let resolvedHref, resolvedImgSrc = null;

            try {
                resolvedHref = new URL(href, base).href;
            } catch {
                resolvedHref = href;
            }

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

    // Helper to fetch HEAD and track redirects
    async function fetchWithRedirectChain(url) {
        const chain = [];
        let currentUrl = url;
        const MAX_REDIRECTS = 10;

        for (let i = 0; i < MAX_REDIRECTS && currentUrl; i++) {
            try {
                let res = await fetch(currentUrl, {
                    method: 'HEAD',
                    redirect: 'manual',
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' }
                });

                if (res.status === 405 || res.status === 501) {
                    res = await fetch(currentUrl, {
                        method: 'GET',
                        redirect: 'manual',
                        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' }
                    });
                }

                chain.push({ url: currentUrl, statusCode: res.status });

                const location = res.headers.get('location');
                if (location) {
                    currentUrl = new URL(location, currentUrl).href;
                } else {
                    currentUrl = null;
                }
            } catch {
                chain.push({ url: currentUrl, statusCode: 'Fetch failed' });
                break;
            }
        }

        return chain;
    }

    // Process internal links (full SEO info)
    async function processInternal(links) {
        return Promise.all(
            links.map(async link => {
                const redirectChain = await fetchWithRedirectChain(link.url);
                const finalUrl = redirectChain.at(-1)?.url || link.url;
                const statusCode = redirectChain[0]?.statusCode || null;

                let isNoindex = false;
                let canonicalUrl = link.url;
                let robotsTxtCheck = { allowed: true };

                try {
                    const res = await fetch(link.url, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' },
                        redirect: 'manual',
                    });

                    const contentType = res.headers.get('content-type') || '';
                    const xRobotsTag = res.headers.get('x-robots-tag') || '';

                    if (xRobotsTag.toLowerCase().includes('noindex')) isNoindex = true;

                    if (contentType.includes('text/html')) {
                        const html = await res.text();
                        const $page = cheerio.load(html);
                        canonicalUrl = scrapeCanonical($page).canonicalUrl || link.url;

                        const metaRobots = $page('meta[name="robots"]').attr('content') || '';
                        if (metaRobots.toLowerCase().includes('noindex')) isNoindex = true;
                    }

                    robotsTxtCheck = await checkRobotsTxt(link.url, '*');
                } catch {
                    robotsTxtCheck = { allowed: false };
                }

                const isIndexable =
                    statusCode === 200 &&
                    !isNoindex &&
                    robotsTxtCheck.allowed;

                return {
                    ...link,
                    statusCode,
                    finalUrl,
                    redirectChain,
                    canonicalUrl,
                    isNoindex,
                    robotsTxtCheck,
                    isIndexable,
                };
            })
        );
    }

    // Process external links (lightweight)
    async function processExternal(links) {
        return Promise.all(
            links.map(async link => {
                const redirectChain = await fetchWithRedirectChain(link.url);
                const finalUrl = redirectChain.at(-1)?.url || link.url;
                const statusCode = redirectChain[0]?.statusCode || null;

                return {
                    url: link.url,
                    anchor: link.anchor, // image or text
                    statusCode,
                    finalUrl,
                };
            })
        );
    }

    const [processedInternal, processedExternal] = await Promise.all([
        processInternal(internalLinks),
        processExternal(externalLinks),
    ]);

    return {
        internalLinks: processedInternal,
        externalLinks: processedExternal,
    };
}
