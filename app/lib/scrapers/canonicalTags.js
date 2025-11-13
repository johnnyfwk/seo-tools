export async function scrapeCanonicalTags($, pageUrl) {
    const pageIssues = [];

    if (!pageUrl) {
        pageIssues.push("Missing page URL parameter.");
        return { canonicalTags: [], pageIssues };
    }

    const canonicalTags = $('link[rel="canonical"]')
        .map((_, el) => $(el).attr('href')?.trim())
        .get()
        .filter(Boolean);

    if (canonicalTags.length === 0) {
        pageIssues.push("No canonical tag found.");
        return { canonicalTags: [], pageIssues };
    }

    const normalize = url => url.replace(/\/$/, '').toLowerCase();

    const results = [];
    for (const originalUrl of canonicalTags) {
        let resolvedUrl;
        const issues = [];

        try {
            resolvedUrl = new URL(originalUrl, pageUrl).href;
        } catch {
            resolvedUrl = originalUrl;
            issues.push(`Invalid canonical URL: ${originalUrl}`);
        }

        let resolvedUrlMatchesOriginalUrl = null;
        if (resolvedUrl) {
            resolvedUrlMatchesOriginalUrl = normalize(resolvedUrl) === normalize(pageUrl);
            if (!resolvedUrlMatchesOriginalUrl) issues.push(`Canonical URL points elsewhere: ${resolvedUrl}`);
        }

        let resolvedUrlStatusCode = null;
        try {
            if (resolvedUrl) {
                const res = await fetch(resolvedUrl, { method: 'HEAD' });
                resolvedUrlStatusCode = res.status;
                if (resolvedUrlStatusCode >= 300 && resolvedUrlStatusCode < 400) issues.push(`Canonical URL redirects (${resolvedUrlStatusCode})`);
                else if (resolvedUrlStatusCode >= 400) issues.push(`Canonical returns error (${resolvedUrlStatusCode})`);
            }
        } catch (err) {
            issues.push(`Failed to fetch canonical URL: ${err.message}`);
        }

        results.push({
            originalUrl,
            resolvedUrl,
            resolvedUrlStatusCode,
            resolvedUrlMatchesOriginalUrl,
            issues
        });
    }

    return { canonicalTags: results, pageIssues };
}
