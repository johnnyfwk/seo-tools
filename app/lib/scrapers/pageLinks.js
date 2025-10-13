export async function scrapePageLinks($, pageUrl) {
    // Resolve relative URLs to absolute
    const base = new URL(pageUrl);

    const links = $('a[href]')
        .map((i, element) => {
            const href = $(element).attr('href');
            const anchorText = $(element).text().trim();

            // Skip if no href
            if (!href) return null;

            // Detect if link is an image file
            const isImageHref = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(href);

            // Detect if the <a> contains an <img>
            const innerImg = $(element).find('img').first();
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

            let anchor;
            if (resolvedImgSrc) {
                anchor = { type: 'image', src: resolvedImgSrc, alt: innerImgAlt };
            } else if (isImageHref) {
                anchor = { type: 'image', src: resolvedHref, alt: innerImgAlt };
            } else if (anchorText) {
                anchor = { type: 'text', text: anchorText };
            } else {
                anchor = { type: 'text', text: "(no text)" };
            }

            return { href: resolvedHref, anchor };
        })
        .get()
        .filter(Boolean);

    // Resolve relative URLs to absolute
    const resolvedLinks = links.map(link => {
        try {
            const url = new URL(link.href, base);
            return { url: url.href, anchor: link.anchor };
        } catch {
            return null; // skip invalid URLs
        }
    }).filter(Boolean);

    // ✅ Separate internal and external links
    const normalizeHostname = (hostname) => hostname.replace(/^www\./, '').toLowerCase();

    const baseHost = normalizeHostname(base.hostname);

    const internalLinks = resolvedLinks.filter(link => {
        try {
            const host = normalizeHostname(new URL(link.url).hostname);
            return host === baseHost || host.endsWith(`.${baseHost}`);
        } catch {
            return false;
        }
    });

    const externalLinks = resolvedLinks.filter(link => {
        try {
            const host = normalizeHostname(new URL(link.url).hostname);
            return !(host === baseHost || host.endsWith(`.${baseHost}`));
        } catch {
            return false;
        }
    });

    // Helper function to follow redirects manually and build the chain
    async function fetchWithRedirectChain(url) {
        const chain = [];
        let currentUrl = url;

        while (currentUrl) {
            try {
                const response = await fetch(currentUrl, {
                    method: 'HEAD',
                    redirect: 'manual', // stop automatic redirect
                });

                const statusCode = response.status;
                chain.push({ url: currentUrl, statusCode });

                const location = response.headers.get('location');
                currentUrl = location ? new URL(location, currentUrl).href : null;
            } catch (err) {
                chain.push({ url: currentUrl, statusCode: "Could not fetch status code" });
                currentUrl = null;
            }
        }

        return chain;
    }

    // Fetch status code and final URL for each link
    async function processLinks(links) {
        return Promise.all(
            links.map(async link => {
                const redirectChain = await fetchWithRedirectChain(link.url);
                const finalUrl = redirectChain[redirectChain.length - 1]?.url || link.url;
                const statusCode = redirectChain[0]?.statusCode || null;

                return {
                    ...link,
                    statusCode,
                    finalUrl,
                    redirectChain,
                };
            })
        );
    }

    // Process internal and external separately (if needed)
    const [processedInternal, processedExternal] = await Promise.all([
        processLinks(internalLinks),
        processLinks(externalLinks),
    ]);

    // Return both sets clearly
    return {
        internalLinks: processedInternal,
        externalLinks: processedExternal,
    };
}

// Helper
function isInternal(url, base) {
    const normalize = (h) => h.replace(/^www\./, '').toLowerCase();
    const host = normalize(new URL(url).hostname);
    const baseHost = normalize(base.hostname);
    return host === baseHost || host.endsWith(`.${baseHost}`);
}