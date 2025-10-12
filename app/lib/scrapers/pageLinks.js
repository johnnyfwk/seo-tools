export async function scrapePageLinks($, pageUrl) {
    const links = $('a[href]')
        .map((i, element) => ({
            href: $(element).attr('href'),
            anchor: $(element).text().trim(),
        }))
        .get();

    // Resolve relative URLs to absolute
    const base = new URL(pageUrl);

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