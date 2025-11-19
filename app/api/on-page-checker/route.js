import { getRedirects } from "@/app/lib/utils/getRedirects";
import { checkRobotsTxt } from "@/app/lib/utils/checkRobotsTxt";
import { browserHeaders } from "@/app/lib/utils/browserHeaders";
import { scrapeWithCheerio } from "@/app/lib/scrapers";
import { scrapeWithPlaywright } from "@/app/lib/scrapers/playwright";
import { isLikelySPA } from "@/app/lib/utils/isLikelySPA";

export async function POST(request) {
    let headers = {};
    let enteredUrlStatusCode = null;
    let finalUrl = null;
    let finalUrlStatusCode = null;

    try {
        const {
            enteredUrl,
            scrapeEvenIfBlocked,
            scrapeOptions = { all: true }
        } = await request.json();

        if (!enteredUrl) return Response.json({ error: "URL is required" }, { status: 400 });

        const {
            finalUrl: resolvedFinalUrl,
            finalUrlStatusCode: resolvedFinalUrlStatusCode,
            redirects
        } = await getRedirects(enteredUrl);

        finalUrl = resolvedFinalUrl;
        finalUrlStatusCode = resolvedFinalUrlStatusCode;
        enteredUrlStatusCode = redirects?.[0]?.statusCode ?? null;

        const robotsTxt = await checkRobotsTxt(finalUrl);

        let html = null;

        if (!robotsTxt.blocked || scrapeEvenIfBlocked) {
            try {
                const res = await fetch(finalUrl, {
                    method: "GET",
                    headers: browserHeaders
                });
                
                if (res.ok) {
                    html = await res.text();
                    res.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
                } else {
                    finalUrlStatusCode = res.status;
                }
            } catch {
                html = null;
            }
        }

        let scrapedData = null;
        let usedPlaywright = false;

        if (html) {
            const likelySPA = isLikelySPA(html);

            if (likelySPA) {
                usedPlaywright = true;
                scrapedData = await scrapeWithPlaywright(finalUrl, scrapeOptions);
            } else {
                scrapedData = await scrapeWithCheerio(html, finalUrl, headers, scrapeOptions);

                // Optional fallback if Cheerio still misses key elements
                const missingH1 = !scrapedData.headings?.h1?.length;
                const missingLinks = !scrapedData.links?.internal?.length;

                if (missingH1 || missingLinks) {
                    usedPlaywright = true;
                    scrapedData = await scrapeWithPlaywright(finalUrl, scrapeOptions);
                }
            }
        } else {
            // Fetch failed, fallback immediately
            usedPlaywright = true;
            scrapedData = await scrapeWithPlaywright(finalUrl, scrapeOptions);
        }

        return Response.json({
            enteredUrl,
            enteredUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects,
            robotsTxt,
            html: html ? "HTML Content Fetched" : null,
            scrapedData,
            usedPlaywright,
            enteredUrlIsBlockedByRobots: robotsTxt.blocked,
        });
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}