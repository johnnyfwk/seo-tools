export function scrapeCanonicalUrl($, pageUrl) {
    const href = $('link[rel="canonical"]').attr('href')?.trim() || '';

    if (!href) return { canonicalUrl: '' };

    try {
        return { canonicalUrl: new URL(href, pageUrl).href };
    } catch {
        return { canonicalUrl: href };
    }
}