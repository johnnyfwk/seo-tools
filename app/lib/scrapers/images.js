// export async function scrapeImages($, pageUrl) {
//     const images = $('img')
//         .map((i, element) => {
//             let src = $(element).attr('src') || "";
//             let alt = $(element).attr('alt') || "";

//             // Resolve relative URLs
//             try {
//                 if (src) {
//                     src = new URL(src, pageUrl).href;
//                 }
//             } catch {
//                 // If it's not a valid URL, leave it as-is
//             }

//             return { src, alt };
//         })
//         .get();

//     return images;
// }

export async function scrapeImages($, pageUrl) {
    const imageElements = $('img').toArray();

    const images = await Promise.all(
        imageElements.map(async (element) => {
            const $el = $(element);

            // Try multiple possible source attributes
            let src =
                $el.attr('src') ||
                $el.attr('data-src') ||
                $el.attr('data-lazy') ||
                $el.attr('data-original') ||
                $el.attr('data-srcset') ||
                "";
            let alt = $el.attr('alt') || "";

            // Resolve relative URLs
            try {
                if (src) {
                    src = new URL(src, pageUrl).href;
                }
            } catch {
                // Leave invalid URLs untouched
            }

            let statusCode = null;
            let finalUrl = src || null;
            let redirectChain = [];

            if (src) {
                try {
                let currentUrl = src;
                let redirectCount = 0;
                let response;

                do {
                    response = await fetch(currentUrl, {
                        method: "HEAD",
                        redirect: "manual",
                    });

                    statusCode = response.status;
                    finalUrl = currentUrl;

                    if (statusCode >= 300 && statusCode < 400) {
                        const location = response.headers.get("location");
                        if (!location) break;

                        const nextUrl = new URL(location, currentUrl).href;
                        redirectChain.push(nextUrl);
                        currentUrl = nextUrl;
                        redirectCount++;
                    } else {
                        break;
                    }
                } while (redirectCount < 10);

                // If no redirects, redirectChain remains empty, finalUrl = src
                } catch (err) {
                    statusCode = "Error";
                    finalUrl = src;
                    redirectChain = ["Fetch failed"];
                }
            }

            return { src, alt, statusCode, finalUrl, redirectChain };
        })
    );

    return images;
}
