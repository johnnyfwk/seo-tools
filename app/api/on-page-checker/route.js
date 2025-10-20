// import { scrapeWithCheerio } from '@/app/lib/scrapers';
// import { checkRobotsTxt } from '@/app/lib/scrapers/robotsTxt';
// import * as utils from '@/app/lib/utils/utils';

// export async function POST(req) {
//     try {
//         let { url } = await req.json();
//         url = url.trim();

//         if (!/^https?:\/\//i.test(url)) {
//             url = 'http://' + url; // fallback if user types "example.com"
//         }

//         if (!url) {
//             return new Response(
//                 JSON.stringify({ error: 'No URL provided.' }),
//                 { status: 400 }
//             );
//         }

//         try {
//             new URL(url);
//         } catch {
//             return new Response(JSON.stringify({ error: 'Invalid URL.' }), { status: 400 });
//         }

//         // 1. Build the redirect chain
//         const redirectChain = await utils.fetchRedirectChain(url);

//         const firstRedirectUrl = redirectChain[0]?.url || '';
//         const secondRedirectUrl = redirectChain[1]?.url || '';
//         const httpRedirectsToHttps = firstRedirectUrl.startsWith('http://') && secondRedirectUrl?.startsWith('https://');

//         // 2. Identify entered status + final URL
//         const enteredUrlStatusCode = redirectChain[0]?.statusCode || null;
//         const finalEntry = redirectChain[redirectChain.length - 1] || {};
//         const finalUrl = finalEntry.url || url;
//         const finalUrlStatusCode = finalEntry.statusCode || null;

//         const robotsTxtEnteredUrl = await checkRobotsTxt(url, '*');
//         const robotsTxtFinalUrl = finalUrl !== url ? await checkRobotsTxt(finalUrl, '*') : robotsTxtEnteredUrl;

//         let scraped = {};

//         // 3. Only scrape if the final status is 200
//         if (enteredUrlStatusCode === 200) {
//             try {
//                 const response = await fetch(finalUrl, {
//                     headers: {
//                         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//                         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//                         "Accept-Language": "en-US,en;q=0.9",
//                     },
//                     redirect: 'follow',
//                 });

//                 if (response.ok) {
//                     const html = await response.text();
//                     const headersObj = Object.fromEntries(response.headers.entries()); // convert Headers to plain object
//                     scraped = await scrapeWithCheerio(html, finalUrl, headersObj);
//                 }
//             } catch (err) {
//                 console.error(`Failed to fetch HTML for ${finalUrl}:`, err.message);
//             }
//         }

//         return new Response(
//             JSON.stringify({
//                 enteredUrl: url,
//                 enteredUrlStatusCode,   // status of the URL the user typed
//                 finalUrl,        // last URL after redirects
//                 finalUrlStatusCode,     // last status
//                 redirectChain,   // full chain with {url, statusCode}
//                 httpRedirectsToHttps,
//                 robotsTxt: {
//                     enteredUrl: robotsTxtEnteredUrl,
//                     finalUrl: robotsTxtFinalUrl,
//                 },
//                 ...scraped,
//             }),
//             {
//                 status: 200,
//                 headers: { 'Content-Type': 'application/json' },
//             }
//         );
//     } catch (err) {
//         return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//     }
// }



import { fetchRedirectInfo } from "@/app/lib/utils/fetchRedirectInfo";
import { scrapeWithCheerio } from "@/app/lib/scrapers";

export async function POST(request) {
    const { url } = await request.json();

    try {
        const {
            enteredUrl,
            enteredUrlStatusCode,
            enteredUrlFetchError,
            finalUrl,
            finalUrlStatusCode,
            finalUrlFetchError,
            redirectChain,
            httpRedirectsToHttps,
        } = await fetchRedirectInfo(url);

        let scraped = [];

        // Determine if the page was redirected
        const isRedirected =
            redirectChain.length > 1 ||
            enteredUrl !== finalUrl ||
            enteredUrlStatusCode !== finalUrlStatusCode;

        // Only scrape if there was no redirect and entered URL returned 200
        if (!isRedirected && enteredUrlStatusCode === 200 && !enteredUrlFetchError) {
            try {
                const response = await fetch(enteredUrl, {
                    headers: {
                        "User-Agent": "SEO-Checker",
                        Accept: "text/html",
                    },
                });

                if (response.ok) {
                    const html = await response.text();
                    scraped = await scrapeWithCheerio(
                        html,
                        enteredUrl,
                        {},
                        {
                            metaTitle: true,
                            metaDescription: true,
                        },
                    );
                }
            } catch (err) {
                console.error(`Failed to scrape ${enteredUrl}:`, err.message);
            }
        }

        return Response.json({
            enteredUrl,
            enteredUrlStatusCode,
            enteredUrlFetchError,
            finalUrl,
            finalUrlStatusCode,
            finalUrlFetchError,
            redirectChain,
            httpRedirectsToHttps,
            ...scraped,
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}