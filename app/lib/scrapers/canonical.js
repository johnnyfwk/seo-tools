export function scrapeCanonical($) {
    const href = $('link[rel="canonical"]').attr('href') || "";
    try {
        return { canonicalUrl: href ? new URL(href, pageUrl).href : "" };
    } catch {
        return { canonicalUrl: href }; // leave as-is if invalid
    }
}