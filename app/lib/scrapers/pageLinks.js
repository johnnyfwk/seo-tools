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
                    const nextUrl = new URL(location, currentUrl).href;
                    currentUrl = nextUrl;
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
    const results = await Promise.all(
        resolvedLinks.map(async link => {
            const redirectChain = await fetchWithRedirectChain(link.url);
            const finalUrl = redirectChain[redirectChain.length - 1]?.url || link.url;
            const originalStatus = redirectChain[0]?.statusCode || null; // status of the original URL

            return {
                url: link.url,          // original link
                anchor: link.anchor,
                statusCode: originalStatus, // final status code
                finalUrl,               // final destination URL
                redirectChain           // array of {url, statusCode}
            };
        })
    );

    return { pageLinks: results };
}