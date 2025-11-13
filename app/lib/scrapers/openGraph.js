import * as cheerio from "cheerio";
import { fetchRedirectInfo } from "../utils/fetchRedirectInfo";

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
    expectedOgFields.forEach((key) => (openGraph[key] = ""));

    $("meta[property^='og:']").each((_, el) => {
        const property = $(el).attr("property");
        const content = $(el).attr("content")?.trim();

        if (!property || !content) return;

        let key = property.replace(/^og:/, "");
        if (key === "site_name") key = "siteName";
        openGraph[key] = content;
    });

    let ogUrlCanonicalUrl = null;
    let ogUrlRedirectInfo = null;

    if (openGraph.url) {
        try {
            // step 1: follow redirects manually
            ogUrlRedirectInfo = await fetchRedirectInfo(openGraph.url);

            // step 2: fetch OG URL HTML and extract its canonical
            const finalUrl = ogUrlRedirectInfo.finalUrl || openGraph.url;

            const res = await fetch(finalUrl, {
                method: "GET",
                redirect: "follow",
                headers: {
                    "User-Agent": "SEO-Checker",
                    "Accept": "text/html",
                },
            });

            if (res.ok) {
                const html = await res.text();
                const $$ = cheerio.load(html);
                ogUrlCanonicalUrl = $$("link[rel='canonical']").attr("href") || null;
            }
        } catch (err) {
            ogUrlRedirectInfo = {
                error: err.message,
                enteredUrl: openGraph.url,
                enteredUrlStatusCode: null,
                finalUrl: null,
                finalUrlStatusCode: null,
            };
        }
    }

    return {
        openGraph: {
            data: openGraph,
            ogUrlCanonicalUrl,
            ogUrlRedirectInfo,
        },
    };
}
