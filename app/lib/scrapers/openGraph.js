import * as cheerio from "cheerio"; 
import { getRedirects } from "../utils/getRedirects";
import { scrapeCanonicalTags } from "./canonicalTags";
import { normaliseUrlKeepSearch } from "@/app/lib/utils/utils";

export async function scrapeOpenGraph($, pageUrl) {
    if (!$) return {};

    const expectedOgFields = [
        "title",
        "type",
        "url",
        "description",
        "image",
        "siteName",
        "video",
        "audio",
        "locale",
    ];

    const openGraph = {};
    expectedOgFields.forEach((key) => (openGraph[key] = null));

    // Extract OG meta tags
    $("meta[property^='og:']").each((_, el) => {
        const property = $(el).attr("property");
        const content = $(el).attr("content")?.trim();
        if (!property || !content) return;

        let key = property.replace(/^og:/, "");
        if (key === "site_name") key = "siteName";

        if (openGraph[key] == null) {
            openGraph[key] = content;
        } else if (Array.isArray(openGraph[key])) {
            openGraph[key].push(content);
        } else {
            openGraph[key] = [openGraph[key], content];
        }
    });

    // Get page canonical URL
    const canonicalData = await scrapeCanonicalTags($, pageUrl);
    const pageCanonicalUrl = canonicalData.canonicalTags?.tags[0]?.resolvedCanonicalUrl || pageUrl;

    // Handle og:url as array
    const ogUrlsRaw = Array.isArray(openGraph.url) ? openGraph.url : [openGraph.url].filter(Boolean);
    const ogUrlResults = [];

    for (const ogUrlRaw of ogUrlsRaw) {
        let ogUrlValid = false;
        let redirectData = {};
        let statusCode = null;
        let finalUrl = null;
        let finalUrlStatusCode = null;
        let visitableRawUrl = null; // The URL users can actually click

        if (ogUrlRaw) {
            try {
                const urlObj = new URL(ogUrlRaw); // validate & parse
                ogUrlValid = true;

                visitableRawUrl = urlObj.href; // use this as the clickable link

                // Follow redirects
                redirectData = await getRedirects(ogUrlRaw);
                statusCode = redirectData.initialUrlStatusCode;
                finalUrl = redirectData.finalUrl;
                finalUrlStatusCode = redirectData.finalUrlStatusCode;
            } catch {
                ogUrlValid = false;
                visitableRawUrl = null; // invalid URL, not visitable
            }
        }

        const matchesPageCanonical =
            ogUrlValid &&
            normaliseUrlKeepSearch(ogUrlRaw) === normaliseUrlKeepSearch(pageCanonicalUrl);

        ogUrlResults.push({
            rawUrl: ogUrlRaw,
            visitableRawUrl, // Frontend can link to this
            valid: ogUrlValid,
            matchesPageCanonical,
            statusCode,
            finalUrl,
            finalUrlStatusCode,
            pageCanonicalUrl,
        });
    }

    // Replace url property with the array of detailed results
    openGraph.url = ogUrlResults;

    return { openGraph };
}
