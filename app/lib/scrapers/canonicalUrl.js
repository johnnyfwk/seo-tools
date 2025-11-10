export async function scrapeCanonicalUrl($, pageUrl) {
    const canonicalTags = $('link[rel="canonical"]');
    const canonicalUrls = canonicalTags
        .map((i, el) => $(el)
        .attr('href')?.trim())
        .get()
        .filter(Boolean);

    if (canonicalUrls.length === 0) {
        return {
            canonicalUrl: '',
            canonicalUrlStatusCode: null,
            isSelfReferential: false,
            canonicalIssues: ['No canonical tag found.'],
        };
    }

    const href = canonicalUrls[0];
    let resolvedUrl;
    try {
        resolvedUrl = new URL(href, pageUrl).href;
    } catch {
        resolvedUrl = href;
    }

    const issues = [];

    // Warn about multiple canonicals
    if (canonicalUrls.length > 1) {
        issues.push(`Multiple canonical tags found (${canonicalUrls.length}).`);
    }

    // Check if self-referential
    const normalisedPage = pageUrl.replace(/\/$/, '');
    const normalisedCanonical = resolvedUrl.replace(/\/$/, '');
    const isSelfReferential = normalisedCanonical === normalisedPage;
    if (!isSelfReferential) {
        issues.push(`Canonical points elsewhere: ${resolvedUrl}`);
    }

    // Cross-domain check
    if (new URL(resolvedUrl).hostname !== new URL(pageUrl).hostname) {
        issues.push(`Canonical points to a different domain (${new URL(resolvedUrl).hostname}).`);
    }

    let canonicalUrlStatusCode = null;

    try {
        const res = await fetch(resolvedUrl, { method: 'HEAD' });
        canonicalUrlStatusCode = res.status;

        if (canonicalUrlStatusCode >= 300 && canonicalUrlStatusCode < 400) {
            issues.push(`Canonical URL redirects (${canonicalUrlStatusCode}).`);
        } else if (canonicalUrlStatusCode >= 400) {
            issues.push(`Canonical URL returns error (${canonicalUrlStatusCode}).`);
        }
    } catch (err) {
        issues.push(`Failed to fetch canonical URL: ${err.message}`);
    }

    return {
        canonicalUrl: {
            url: resolvedUrl,
            statusCode: canonicalUrlStatusCode,
            isSelfReferential,
            issues,
        }
    };
}