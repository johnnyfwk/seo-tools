import { getRedirects } from "@/app/lib/utils/getRedirects";
import { checkRobotsTxt } from "@/app/lib/utils/checkRobotsTxt";
import { scrapeXmlSitemaps } from "@/app/lib/scrapers/xmlSitemaps";
import { scrapeWithCheerio } from "@/app/lib/scrapers";
import { browserHeaders } from "@/app/lib/utils/browserHeaders";
import * as utils from '@/app/lib/utils/utils';

export async function POST(request) {    
    try {
        const {
            enteredUrl,
            scrapeEvenIfBlocked,
            scrapeOptions = { all: true }
        } = await request.json();

        const {
            valid,
            error,
            url: normalizedUrl
        } = utils.validateUrlBackend(enteredUrl);
        
        if (!valid) {
            return Response.json({ error }, { status: 400 });
        }

        let headers = {};
        let enteredUrlStatusCode = null;
        let finalUrl = null;
        let finalUrlStatusCode = null;
        let redirects = [];
        let contentType = null;

        let redirectData;
        try {
            redirectData = await getRedirects(normalizedUrl);
        } catch (err) {
            return Response.json(
                {
                    error: "Failed to fetch URL (redirect resolution failed)",
                    details: err.message,
                },
                { status: 400 }
            );
        }

        enteredUrlStatusCode = redirectData.initialUrlStatusCode;
        finalUrl = redirectData.finalUrl;
        finalUrlStatusCode = redirectData.finalUrlStatusCode;
        redirects = redirectData.redirects;

        // --- ROBOTS.TXT ---
        const robotsTxt = await checkRobotsTxt(finalUrl);

        // --- XML SITEMAPS ---
        const xmlSitemaps = await scrapeXmlSitemaps(finalUrl);

        // --- FETCH RESOURCE ---
        let resourceData = null;
        let resourceExists = false;
        let isHtml = false;
        let isPdf = false;
        let isImage = false;
        let isCss = false;
        let isJs = false;
        let isOther = false;

        if (!robotsTxt.blocked || scrapeEvenIfBlocked) {
            try {
                const response = await fetch(finalUrl, {
                    method: "GET",
                    headers: browserHeaders
                });

                finalUrlStatusCode = response.status;
                resourceExists = response.ok;

                contentType = response.headers.get("content-type") || "";

                const urlExtension = finalUrl.split('.').pop().toLowerCase();
                const isCssFallback = urlExtension === 'css';
                const isJsFallback = urlExtension === 'js';

                // Categorize content type
                isHtml = contentType.includes("text/html") && !isCssFallback && !isJsFallback;
                isPdf = contentType.includes("application/pdf");
                isImage = contentType.startsWith("image/");
                isCss = contentType.includes("text/css") || isCssFallback;
                isJs = contentType.includes("application/javascript") ||
                    contentType.includes("text/javascript") ||
                    isJsFallback;
                isOther = !isHtml && !isPdf && !isImage && !isCss && !isJs;

                headers = {};
                response.headers.forEach((value, key) => headers[key.toLowerCase()] = value);

                if (isHtml && resourceExists) {
                    const html = await response.text();
                    resourceData = await scrapeWithCheerio(html, finalUrl, headers, scrapeOptions);
                } else {
                    resourceData = null; // For PDFs, images, or other resources
                }

            } catch (err) {
                console.warn("Resource fetch failed:", err.message);
                resourceExists = false;

                return Response.json(
                    {
                        error: "Failed to fetch the target page.",
                        details: err.message
                    },
                    { status: 400 }
                );
            }
        }

        return Response.json({
            enteredUrl,
            enteredUrlStatusCode,
            finalUrl,
            finalUrlStatusCode,
            redirects,
            robotsTxt,
            xmlSitemaps,
            resourceExists,
            contentType,
            isHtml,
            isPdf,
            isImage,
            isCss,
            isJs,
            isOther,
            headers,
            scrapedData: resourceData,
            enteredUrlIsBlockedByRobots: robotsTxt.blocked,
        });

    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}
