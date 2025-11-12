// import { fetchRedirectInfo } from "@/app/lib/utils/fetchRedirectInfo";
// import { scrapeWithCheerio } from "@/app/lib/scrapers";
// import { checkRobotsTxt } from "@/app/lib/scrapers/robotsTxt";

// export async function POST(request) {
//     try {
//         const { enteredUrl, scrapeEvenIfBlocked = false } = await request.json();

//         const redirectData = await fetchRedirectInfo(enteredUrl);

//         const {
//             enteredUrlStatusCode,
//             enteredUrlFetchError,
//             finalUrl,
//             finalUrlStatusCode,
//             finalUrlFetchError,
//             redirectChain,
//         } = redirectData;

//         const isRedirected = redirectChain.length > 1;

//         const robotsResult = await checkRobotsTxt(finalUrl, "SEO-Checker") || {};

//         // Base response (always returned)
//         const baseResponse = {
//             enteredUrl,
//             finalUrl,
//             enteredUrlStatusCode,
//             finalUrlStatusCode,
//             redirectChain,
//             isRedirected,
//             robotsTxt: {
//                 url: robotsResult.robotsTxtUrl,
//                 allowed: robotsResult.allowed,
//                 reason: robotsResult.reason,
//                 fetchError: robotsResult.error || null,
//             },
//         };

//         // Respect robots.txt (unless override)
//         if (!robotsResult.allowed && !scrapeEvenIfBlocked) {
//             return Response.json({
//                 ...baseResponse,
//                 message: "🚫 Blocked by robots.txt — scraping skipped.",
//             });
//         }

//         // Skip scraping for redirects, errors, or non-200s
//         if (
//             isRedirected ||
//             enteredUrlStatusCode !== 200 ||
//             enteredUrlFetchError ||
//             finalUrlStatusCode !== 200 ||
//             finalUrlFetchError
//         ) {
//             return Response.json({
//                 ...baseResponse,
//                 message: "❌ Page not suitable for scraping (redirected, error, or non-200 status).",
//             });
//         }

//         // Fetch and scrape HTML only if allowed and 200 OK
//         const response = await fetch(finalUrl, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://yourdomain.com)",
//             },
//         });
//         const html = await response.text();

//         const scrapedData = await scrapeWithCheerio(html, finalUrl, {}, { all: true });

//         return Response.json({
//             ...baseResponse,
//             ...scrapedData,
//             message: "✅ Scrape successful",
//         });
//     } catch (error) {
//         console.error("Error in on-page-checker:", error);
//         return Response.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }

import { fetchRedirectInfo } from "@/app/lib/utils/fetchRedirectInfo";
import { scrapeWithCheerio } from "@/app/lib/scrapers";
import { checkRobotsTxt } from "@/app/lib/scrapers/robotsTxt";

export async function POST(request) {
    try {
        const { enteredUrl, scrapeEvenIfBlocked = false } = await request.json();

        const redirectData = await fetchRedirectInfo(enteredUrl);

        const {
            enteredUrlStatusCode,
            enteredUrlFetchError,
            finalUrl,
            finalUrlStatusCode,
            finalUrlFetchError,
            redirectChain,
        } = redirectData;

        const isRedirected = redirectChain.length > 1;
        const isSameUrl = enteredUrl === finalUrl;

        const robotsResult = await checkRobotsTxt(enteredUrl, "SEO-Checker") || {};

        // Base response (always returned)
        const baseResponse = {
            enteredUrl,
            finalUrl,
            enteredUrlStatusCode,
            finalUrlStatusCode,
            finalUrlFetchError,
            redirectChain,
            isRedirected,
            robotsTxt: {
                url: robotsResult.robotsTxtUrl,
                allowed: robotsResult.allowed,
                reason: robotsResult.reason,
                fetchError: robotsResult.error || null,
            },
        };

        // Respect robots.txt (unless override)
        if (!robotsResult.allowed && !scrapeEvenIfBlocked) {
            return Response.json({
                ...baseResponse,
                message: "🚫 Blocked by robots.txt — scraping skipped.",
            });
        }

        // ❌ If entered URL didn’t return 200 or it redirected → don’t scrape
        if (!isSameUrl || enteredUrlStatusCode !== 200 || enteredUrlFetchError) {
            return Response.json({
                ...baseResponse,
                message: "❌ Entered URL redirected, errored, or returned non-200 — scraping skipped.",
            });
        }

        // ✅ Scrape only the entered URL (when it’s a clean 200)
        const response = await fetch(enteredUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://yourdomain.com)",
                "Accept": "text/html",
            },
        });

        const html = await response.text();

        const scrapedData = await scrapeWithCheerio(
            html,
            enteredUrl,
            {},
            {
                all: true,
                xmlSitemap: false,
            },
        );

        return Response.json({
            ...baseResponse,
            ...scrapedData,
            message: "✅ Scrape successful",
        });
    } catch (error) {
        console.error("Error in on-page-checker:", error);
        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}