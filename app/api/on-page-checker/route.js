import { getRedirects } from "@/app/lib/utils/getRedirects";
import { checkRobotsTxt } from "@/app/lib/utils/checkRobotsTxt";
import { scrapeXmlSitemaps } from "@/app/lib/scrapers/xmlSitemaps";
import { scrapeWithCheerio } from "@/app/lib/scrapers";
import { browserHeaders } from "@/app/lib/utils/browserHeaders";

export async function POST(request) {
    let headers = {};
    let enteredUrlStatusCode = null;
    let finalUrl = null;
    let finalUrlStatusCode = null;
    
    try {
        const {
            enteredUrl,
            scrapeEvenIfBlocked,
            scrapeOptions = { all: true },
        } = await request.json();

        if (!enteredUrl) {
            return Response.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // FOLLOW REDIRECTS
        const {
            finalUrl: resolvedFinalUrl,
            finalUrlStatusCode: resolvedFinalUrlStatusCode,
            redirects,
        } = await getRedirects(enteredUrl);

        finalUrl = resolvedFinalUrl;
        finalUrlStatusCode = resolvedFinalUrlStatusCode;
        enteredUrlStatusCode = redirects?.[0]?.statusCode ?? null;

        const robotsTxt = await checkRobotsTxt(finalUrl);

        const xmlSitemaps = await scrapeXmlSitemaps(finalUrl);

        // FETCH PAGE HTML IF ALLOWED BY ROBOTS.TXT
        let html = null;
        let htmlResponse = null;

        if (!robotsTxt.blocked || scrapeEvenIfBlocked) {
            try {
                htmlResponse = await fetch(finalUrl, {
                    method: "GET",
                    headers: browserHeaders,
                });

                if (htmlResponse.ok) {
                    html = await htmlResponse.text();
                    // Extract headers to pass to scrapers (e.g., X-Robots-Tag)
                    htmlResponse.headers.forEach((value, key) => {
                        headers[key.toLowerCase()] = value;
                    });
                } else {
                    finalUrlStatusCode = htmlResponse.status;
                }
            } catch (err) {
                console.warn("HTML fetch failed:", err.message);
                html = null;
            }
        }

        const htmlExists = Boolean(html?.trim());

        // RUN SCRAPERS
        const scrapedData = htmlExists
            ? await scrapeWithCheerio(html, finalUrl, headers, scrapeOptions)
            : {};

        return Response.json({
            enteredUrl,
            enteredUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects,
            robotsTxt,
            xmlSitemaps,
            htmlExists,
            scrapedData,
            enteredUrlIsBlockedByRobots: robotsTxt.blocked,
        });
    } catch (err) {
        console.error(err);
        return Response.json(
            {
                error: "Internal Server Error",
                details: err.message
            },
            { status: 500 }
        );
    }
}