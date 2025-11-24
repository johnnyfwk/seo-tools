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

    const multiValueKeys = ["image", "video", "audio", "url"];

    // Extract OG meta tags
    $("meta[property^='og:']").each((_, el) => {
        const property = $(el).attr("property");
        const content = $(el).attr("content")?.trim();
        if (!property || !content) return;

        let key = property.replace(/^og:/, "");
        if (key === "site_name") key = "siteName";

        if (multiValueKeys.includes(key)) {
            if (!openGraph[key]) openGraph[key] = [];
            openGraph[key].push(content);
        } else {
            // single value: only keep first occurrence
            if (!openGraph[key]) openGraph[key] = content;
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
