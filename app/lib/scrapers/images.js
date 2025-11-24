import * as utils from '@/app/lib/utils/utils';
import { getRedirects } from '../utils/getRedirects';

export async function scrapeImages($, pageUrl, { checkStatus = false } = {}) {
    const limit = utils.createLimiter(5);
    const imageElements = $('img').toArray();

    const images = await Promise.all(
        imageElements.map(el => limit(async () => {
            const $el = $(el);
            const alt = $el.attr('alt') || '';

            // Gather all possible image URLs
            let urls = [];
            const srcAttrs = [
                'src',
                'data-src',
                'data-lazy',
                'data-original',
                'data-srcset'
            ];

            for (const attr of srcAttrs) {
                const val = $el.attr(attr);
                if (!val) continue;

                if (attr === 'data-srcset' || val.includes(',')) {
                    // Handle srcset with multiple URLs
                    val.split(',').forEach(item => {
                        const urlPart = item.trim().split(' ')[0];
                        if (urlPart) urls.push(urlPart);
                    });
                } else {
                    urls.push(val);
                }
            }

            // Resolve relative URLs
            urls = urls.map(url => {
                try {
                    return new URL(url, pageUrl).href;
                } catch {
                    return url; // keep invalid URLs for reporting
                }
            });

            if (!checkStatus) {
                return urls.map(src => ({
                    src,
                    alt,
                    initialUrl: src,
                    initialUrlStatusCode: null,
                    finalUrl: src,
                    finalUrlStatusCode: null,
                    redirects: []
                }));
            }

            const redirectResults = await Promise.all(
                urls.map(async (url) => {
                    try {
                        return await getRedirects(url);
                    } catch (err) {
                        return {
                            initialUrl: url,
                            initialUrlStatusCode: null,
                            finalUrl: url,
                            finalUrlStatusCode: null,
                            redirects: []
                        };
                    }
                })
            );

            return redirectResults.map((result, i) => ({
                src: urls[i],
                alt,

                initialUrl: result.initialUrl,
                initialUrlStatusCode: result.initialUrlStatusCode,

                finalUrl: result.finalUrl,
                finalUrlStatusCode: result.finalUrlStatusCode,

                redirects: result.redirects
            }));
        }))
    );

    // Flatten the array because each img may return multiple URLs
    return { images: images.flat() };
}
