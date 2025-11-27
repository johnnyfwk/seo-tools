import { browserHeaders } from "./browserHeaders";

export async function fetchResource(url, scrapeOptions, scrapeWithCheerio) {
    let result = {
        headers: {},
        exists: false,
        isHtml: false,
        isPdf: false,
        isImage: false,
        isCss: false,
        isJs: false,
        isOther: false,
        contentType: null,
        data: null,
    };

    const response = await fetch(url, {
        method: "GET",
        headers: browserHeaders
    });

    result.exists = response.ok;

    result.contentType = response.headers.get("content-type") || "";

    const urlExtension = url.split('.').pop().toLowerCase();
    const isCssFallback = urlExtension === "css";
    const isJsFallback = urlExtension === "js";

    result.isHtml = result.contentType.includes("text/html") && !isCssFallback && !isJsFallback;
    result.isPdf = result.contentType.includes("application/pdf");
    result.isImage = result.contentType.startsWith("image/");
    result.isCss = result.contentType.includes("text/css") || isCssFallback;
    result.isJs = result.contentType.includes("application/javascript") ||
        result.contentType.includes("text/javascript") ||
        isJsFallback;
    result.isOther = !result.isHtml && !result.isPdf && !result.isImage && !result.isCss && !result.isJs;

    response.headers.forEach((value, key) => (result.headers[key.toLowerCase()] = value));

    if (result.exists && result.isHtml) {
        const html = await response.text();
        result.data = await scrapeWithCheerio(html, url, result.headers, scrapeOptions);
    }

    return result;
}