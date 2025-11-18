import { getRedirects } from "@/app/lib/utils/getRedirects";
import { checkRobotsTxt } from "@/app/lib/utils/checkRobotsTxt";
import { scrapeWithCheerio } from "@/app/lib/scrapers";

export async function POST(request) {
    try {
        const {
            enteredUrl,
            scrapeEvenIfBlocked,
            scrapeOptions = {
                "all": true,
            },
        } = await request.json();

        if (!enteredUrl) {
            return Response.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // FOLLOW REDIRECTS
        const {
            finalUrl,
            finalUrlStatusCode,
            redirects,
        } = await getRedirects(enteredUrl);

        const enteredUrlStatusCode = redirects?.[0]?.statusCode ?? null;

        // CHECK ROBOTS.TXT
        const robotsTxt = await checkRobotsTxt(finalUrl);

        // FETCH PAGE HTML IF ALLOWED BY ROBOTS.TXT
        let html = null;
        if (!robotsTxt.blocked || scrapeEvenIfBlocked) {
            try {
                const htmlResponse = await fetch(finalUrl);
                html = htmlResponse.ok
                    ? await htmlResponse.text()
                    : null;
            } catch {
                html = null;
            }
        }

        // RUN SCRAPERS
        let scrapedData = null;
        if (html) {
            scrapedData = await scrapeWithCheerio(
                html,
                finalUrl,
                {},
                scrapeOptions,
            )
        }

        return Response.json({
            enteredUrl,
            enteredUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects,
            robotsTxt,
            html,
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