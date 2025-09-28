export function scrapeCanonical($) {
    return {
        canonicalUrl: $('link[rel="canonical"]').attr('href') || "",
    };
}