// import * as utils from '@/app/lib/utils/utils';

// export async function scrapeImages($, pageUrl, { checkStatus = false } = {}) {
//     const limit = utils.createLimiter(5);
//     const imageElements = $('img').toArray();

//     const images = await Promise.all(
//         imageElements.map(el => limit(async () => {
//             const $el = $(el);

//             let src =
//                 $el.attr('src') ||
//                 $el.attr('data-src') ||
//                 $el.attr('data-lazy') ||
//                 $el.attr('data-original') ||
//                 $el.attr('data-srcset') ||
//                 "";
//             const alt = $el.attr('alt') || "";

//             // Handle srcset with multiple URLs
//             if (src.includes(',')) src = src.split(',').pop().trim().split(' ')[0];

//             // Resolve relative URLs
//             try { src = new URL(src, pageUrl).href; } catch {}

//             let statusCode = null;

//             if (checkStatus && src) {
//                 try {
//                     const res = await fetch(src, { method: "HEAD", redirect: "manual" });
//                     statusCode = res.status;
//                 } catch {
//                     statusCode = null;
//                 }
//             }

//             return { src, alt, statusCode };
//         }))
//     );

//     return { images };
// }


import * as utils from '@/app/lib/utils/utils';

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
            urls = urls.map(u => {
                try {
                    return new URL(u, pageUrl).href;
                } catch {
                    return u; // keep invalid URLs for reporting
                }
            });

            // Check status if requested
            let statusCodes = [];
            if (checkStatus) {
                statusCodes = await Promise.all(
                    urls.map(async (url) => {
                        try {
                            const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
                            return res.status;
                        } catch {
                            return null;
                        }
                    })
                );
            } else {
                statusCodes = urls.map(() => null);
            }

            return urls.map((src, i) => ({
                src,
                alt,
                statusCode: statusCodes[i]
            }));
        }))
    );

    // Flatten the array because each img may return multiple URLs
    return { images: images.flat() };
}
