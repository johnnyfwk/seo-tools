import { getRedirects } from "@/app/lib/utils/getRedirects";
import { checkRobotsTxt } from "@/app/lib/utils/checkRobotsTxt";

export async function POST(request) {
    try {
        const { enteredUrl, scrapeEvenIfBlocked } = await request.json();

        if (!enteredUrl) {
            return Response.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const {
            finalUrl,
            finalUrlStatusCode,
            redirects,
        } = await getRedirects(enteredUrl);

        const enteredUrlStatusCode = redirects?.[0]?.statusCode ?? null;

        const robotsTxt = await checkRobotsTxt(finalUrl);

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

        return Response.json({
            enteredUrl,
            enteredUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects,
            robotsTxt,
            html,
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