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
//         const isSameUrl = enteredUrl === finalUrl;

//         const robotsResult = await checkRobotsTxt(enteredUrl, "SEO-Checker") || {};

//         // Base response (always returned)
//         const baseResponse = {
//             enteredUrl,
//             finalUrl,
//             enteredUrlStatusCode,
//             finalUrlStatusCode,
//             finalUrlFetchError,
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

//         // ❌ If entered URL didn’t return 200 or it redirected → don’t scrape
//         if (!isSameUrl || enteredUrlStatusCode !== 200 || enteredUrlFetchError) {
//             return Response.json({
//                 ...baseResponse,
//                 message: "❌ Entered URL redirected, errored, or returned non-200 — scraping skipped.",
//             });
//         }

//         // ✅ Scrape only the entered URL (when it’s a clean 200)
//         const response = await fetch(enteredUrl, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://yourdomain.com)",
//                 "Accept": "text/html",
//             },
//         });

//         const html = await response.text();

//         const scrapedData = await scrapeWithCheerio(
//             html,
//             enteredUrl,
//             {},
//             {
//                 all: true,
//                 xmlSitemap: false,
//             },
//         );

//         return Response.json({
//             ...baseResponse,
//             ...scrapedData,
//             message: "✅ Scrape successful",
//         });
//     } catch (error) {
//         console.error("Error in on-page-checker:", error);
//         return Response.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

import { urlEvaluation } from "@/app/lib/utils/urlEvaluation";
import { scrapeWithCheerio } from "@/app/lib/scrapers";

export async function POST(request) {
    try {
        const { enteredUrl, scrapeEvenIfBlocked = false } = await request.json();

        // Run URL evaluation
        const evaluationResult = await urlEvaluation(enteredUrl, "SEO-Checker");
        const evaluation = evaluationResult.baseUrlEvaluation;

        // Check if scraping is allowed
        if (!evaluation.shouldScrape && !scrapeEvenIfBlocked) {
            return Response.json(
                { baseUrlEvaluation: evaluation },
                { status: 400 }
            );
        }

        // Fetch the final URL
        const res = await fetch(evaluation.finalUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.118 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.trafalgar.com/"
            },
        });

        const html = await res.text();

        // Scrape with Cheerio
        const scrapedData = await scrapeWithCheerio(
            html,
            evaluation.finalUrl,
            {},
            { all: true, xmlSitemap: false }
        );

        // Return combined response with baseUrlEvaluation preserved
        return Response.json({
            baseUrlEvaluation: evaluation,
            scrapedData,
            message: "✅ Scrape successful"
        });

    } catch (err) {
        console.error(err);
        return Response.json(
            { baseUrlEvaluation: null, error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}
