export async function scrapePageLinks($, pageUrl) {
    const links = $('a[href]')
        .map((i, element) => ({
            href: $(element).attr('href'),
            anchor: $(element).text().trim(),
        }))
        .get();

    // Resolve relative URLs to absolute
    const base = new URL(pageUrl);

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
            return host === baseHost;
        } catch {
            return false;
        }
    });

    const externalLinks = resolvedLinks.filter(link => {
        try {
            const host = normalizeHostname(new URL(link.url).hostname);
            return host !== baseHost;
        } catch {
            return false;
        }
    });

    // Helper function to follow redirects manually and build the chain
    async function fetchWithRedirectChain(url) {
        const chain = [];
        let currentUrl = url;
        let statusCode = null;

        while (currentUrl) {
            try {
                const response = await fetch(currentUrl, {
                    method: 'HEAD',
                    redirect: 'manual', // stop automatic redirect
                });

                statusCode = response.status;

                // If redirect, get the Location header
                const location = response.headers.get('location');
                chain.push({ url: currentUrl, statusCode });

                if (location) {
                    currentUrl = new URL(location, currentUrl).href;
                } else {
                    currentUrl = null; // no more redirects
                }
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
                const originalStatus = redirectChain[0]?.statusCode || null;

                return {
                    url: link.url,
                    anchor: link.anchor,
                    statusCode: originalStatus,
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