// import * as cheerio from "cheerio"; 
// import { getRedirects } from "../utils/getRedirects";
// import { scrapeCanonicalTags } from "./canonicalTags";
// import { normaliseUrlKeepSearch } from "@/app/lib/utils/utils";

// export async function scrapeOpenGraph($, pageUrl) {
//     if (!$) return {};

//     const expectedOgFields = [
//         "title",
//         "type",
//         "url",
//         "description",
//         "image",
//         "siteName",
//         "video",
//         "audio",
//         "locale",
//     ];

//     const openGraph = {};
//     expectedOgFields.forEach((key) => (openGraph[key] = null));

//     // Extract OG meta tags
//     $("meta[property^='og:']").each((_, el) => {
//         const property = $(el).attr("property");
//         const content = $(el).attr("content")?.trim();
//         if (!property || !content) return;

//         let key = property.replace(/^og:/, "");
//         if (key === "site_name") key = "siteName";

//         if (openGraph[key] == null) {
//             openGraph[key] = content;
//         } else if (Array.isArray(openGraph[key])) {
//             openGraph[key].push(content);
//         } else {
//             openGraph[key] = [openGraph[key], content];
//         }
//     });

//     // Get page canonical URL
//     const canonicalData = await scrapeCanonicalTags($, pageUrl);
//     const pageCanonicalUrl = canonicalData.canonicalTags?.tags[0]?.resolvedCanonicalUrl || pageUrl;

//     // Handle og:url as array
//     const ogUrlsRaw = Array.isArray(openGraph.url) ? openGraph.url : [openGraph.url].filter(Boolean);
//     const ogUrlResults = [];

//     for (const ogUrlRaw of ogUrlsRaw) {
//         let ogUrlValid = false;
//         let redirectData = {};
//         let statusCode = null;
//         let finalUrl = null;
//         let finalUrlStatusCode = null;
//         let visitableRawUrl = null; // The URL users can actually click

//         if (ogUrlRaw) {
//             try {
//                 const urlObj = new URL(ogUrlRaw); // validate & parse
//                 ogUrlValid = true;

//                 visitableRawUrl = urlObj.href; // use this as the clickable link

//                 // Follow redirects
//                 redirectData = await getRedirects(ogUrlRaw);
//                 statusCode = redirectData.initialUrlStatusCode;
//                 finalUrl = redirectData.finalUrl;
//                 finalUrlStatusCode = redirectData.finalUrlStatusCode;
//             } catch {
//                 ogUrlValid = false;
//                 visitableRawUrl = null; // invalid URL, not visitable
//             }
//         }

//         const matchesPageCanonical =
//             ogUrlValid &&
//             normaliseUrlKeepSearch(ogUrlRaw) === normaliseUrlKeepSearch(pageCanonicalUrl);

//         ogUrlResults.push({
//             rawUrl: ogUrlRaw,
//             visitableRawUrl, // Frontend can link to this
//             valid: ogUrlValid,
//             matchesPageCanonical,
//             statusCode,
//             finalUrl,
//             finalUrlStatusCode,
//             pageCanonicalUrl,
//         });
//     }

//     // Replace url property with the array of detailed results
//     openGraph.url = ogUrlResults;

//     return { openGraph };
// }


import * as cheerio from "cheerio"; 
import { getRedirects } from "../utils/getRedirects";
import { scrapeCanonicalTags } from "./canonicalTags";
import { scrapeMetaRobotsTag } from "./metaRobotsTag";
import { checkRobotsTxt } from "../utils/checkRobotsTxt";

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

    // Handle og:url as array
    const ogUrls = Array.isArray(openGraph.url)
        ? openGraph.url
        : [openGraph.url].filter(Boolean);

    const results = [];

    for (const ogUrl of ogUrls) {
        let validUrl = true;
        let visitableRawUrl = null;

        // Validate URL
        try {
            visitableRawUrl = new URL(ogUrl).href;
        } catch {
            validUrl = false;
            results.push({
                rawUrl: ogUrl,
                validUrl: false,
                error: "Invalid URL format"
            });
            continue;
        }

        // --- 3. Resolve redirects ---
        const redirectData = await getRedirects(visitableRawUrl);

        const initialUrl = redirectData.initialUrl;
        const initialStatus = redirectData.initialUrlStatusCode;
        const finalUrl = redirectData.finalUrl;
        const finalStatus = redirectData.finalUrlStatusCode;

        // --- 4. Check robots.txt for final URL ---
        const robotsTxt = await checkRobotsTxt(finalUrl);

        // --- 5. Fetch final URL HTML ---
        let $final = null;
        let metaRobots = null;
        let canonical = null;

        try {
            const res = await fetch(finalUrl);
            if (res.ok) {
                const html = await res.text();
                $final = cheerio.load(html);

                // Extract meta robots
                metaRobots = scrapeMetaRobotsTag($final, res.headers)?.metaRobotsTag;

                // Extract canonical for the final URL only
                canonical = (await scrapeCanonicalTags($final, finalUrl)).canonicalTags;
            }
        } catch (err) {
            // If HTML fetch fails, still report redirects + robots
        }

        // --- 6. Push result ---
        results.push({
            rawUrl: ogUrl,

            initialUrl,
            initialUrlStatusCode: initialStatus,

            finalUrl,
            finalUrlStatusCode: finalStatus,

            robotsTxt,
            metaRobots,
            canonical,

            redirects: redirectData.redirects
        });
    }

    openGraph.url = results;

    return { openGraph };
}
