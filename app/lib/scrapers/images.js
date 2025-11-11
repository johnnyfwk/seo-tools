import * as utils from '@/app/lib/utils/utils';

export async function scrapeImages($, pageUrl, { checkStatus = false } = {}) {
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

            let statusCode = null;

            if (checkStatus && src) {
                try {
                    const res = await fetch(src, { method: "HEAD", redirect: "manual" });
                    statusCode = res.status;
                } catch {
                    statusCode = null;
                }
            }

            return { src, alt, statusCode };
        }))
    );

    return { images };
}
