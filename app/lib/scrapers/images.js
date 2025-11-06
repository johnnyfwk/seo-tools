import * as utils from '@/app/lib/utils/utils';

export async function scrapeImages($, pageUrl) {
    const limit = utils.createLimiter(5);

    const imageElements = $('img').toArray();

    const images = await Promise.all(
        imageElements.map(el => limit(async () => {
            const $el = $(el);

            let src =
                $el.attr('src') ||
                $el.attr('data-src') ||
                $el.attr('data-lazy') ||
                $el.attr('data-original') ||
                $el.attr('data-srcset') ||
                "";
            const alt = $el.attr('alt') || "";

            // Handle srcset with multiple URLs
            if (src.includes(',')) src = src.split(',').pop().trim().split(' ')[0];

            // Resolve relative URLs
            try { src = new URL(src, pageUrl).href; } catch {}

            // Optionally fetch headers to check status
            let statusCode = null;
            let finalUrl = src;
            let redirectChain = [];

            if (src) {
                try {
                    let currentUrl = src;
                    let redirectCount = 0;
                    let response;

                    do {
                        response = await fetch(currentUrl, { method: "HEAD", redirect: "manual" });
                        statusCode = response.status;
                        finalUrl = currentUrl;

                        if (statusCode >= 300 && statusCode < 400) {
                            const location = response.headers.get("location");
                            if (!location) break;
                            const nextUrl = new URL(location, currentUrl).href;
                            redirectChain.push(nextUrl);
                            currentUrl = nextUrl;
                            redirectCount++;
                        } else break;

                    } while (redirectCount < 10);

                } catch {
                    statusCode = null;
                    redirectChain.push("Fetch failed");
                }
            }

            return { src, alt, statusCode, finalUrl, redirectChain };
        }))
    );

    return { images };
}
