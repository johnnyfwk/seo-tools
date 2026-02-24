import * as cheerio from "cheerio"; 
import { getRedirects } from "../utils/getRedirects";
import { scrapeCanonicalTags } from "./canonicalTags";
import { scrapeMetaRobotsAndXRobotsTag } from "./metaRobotsAndXRobotsTag";
import { checkRobotsTxt } from "../utils/checkRobotsTxt";

export async function scrapeOpenGraph($) {
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
            if (!openGraph[key]) openGraph[key] = content;
        }
    });

    const ogUrls = Array.isArray(openGraph.url)
        ? openGraph.url
        : [openGraph.url].filter(Boolean);

    const results = [];

    for (const ogUrl of ogUrls) {
        let validUrl = true;
        let visitableRawUrl = null;

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

        const redirectData = await getRedirects(visitableRawUrl);

        const initialUrl = redirectData.initialUrl;
        const initialStatus = redirectData.initialUrlStatusCode;
        const finalUrl = redirectData.finalUrl;
        const finalStatus = redirectData.finalUrlStatusCode;

        const robotsTxt = await checkRobotsTxt(finalUrl);

        let $final = null;
        let metaRobotsAndXRobots = null;
        let canonical = null;

        try {
            const res = await fetch(finalUrl);
            if (res.ok) {
                const html = await res.text();
                $final = cheerio.load(html);

                metaRobotsAndXRobots = scrapeMetaRobotsAndXRobotsTag($final, res.headers)?.metaRobotsAndXRobotsTag;

                canonical = (await scrapeCanonicalTags($final, finalUrl)).canonicalTags;
            }
        } catch (err) {
            // If HTML fetch fails, still report redirects + robots
        }

        results.push({
            rawUrl: ogUrl,

            initialUrl,
            initialUrlStatusCode: initialStatus,

            finalUrl,
            finalUrlStatusCode: finalStatus,

            robotsTxt,
            metaRobotsAndXRobots,
            canonical,

            redirects: redirectData.redirects
        });
    }

    openGraph.url = results;

    return { openGraph };
}
