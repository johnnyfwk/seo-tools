export async function scrapeCanonicalTag($, pageUrl) {
    const issues = [];

    if (!pageUrl) {
        issues.push("Missing page URL parameter in canonical scraper.");
        return {
            canonicalTag: {
                url: '',
                statusCode: null,
                isSelfReferential: true,
                issues,
            }
        };
    }

    const canonicalTags = $('link[rel="canonical"]');
    const canonicalUrls = canonicalTags
        .map((i, el) => $(el).attr('href')?.trim())
        .get()
        .filter(Boolean);

    // If no canonical, assume page is self-referential and skip HTTP fetch
    if (canonicalUrls.length === 0) {
        issues.push('No canonical tag found. Assuming page is self-referential.');
        return {
            canonicalTag: {
                url: '',
                statusCode: null,
                isSelfReferential: true,
                issues,
            }
        };
    }

    const href = canonicalUrls[0];
    let resolvedUrl;
    try {
        resolvedUrl = new URL(href, pageUrl).href;
    } catch {
        resolvedUrl = href;
        issues.push(`Invalid canonical URL format: ${href}`);
    }

    let isSelfReferential = true;
    try {
        const normalisedPage = pageUrl.replace(/\/$/, '');
        const normalisedCanonical = resolvedUrl.replace(/\/$/, '');
        isSelfReferential = normalisedCanonical === normalisedPage;

        if (!isSelfReferential) {
            issues.push(`Canonical URL points elsewhere: ${resolvedUrl}`);
        }
    } catch (err) {
        issues.push(`Failed to compare canonical and page URL: ${err.message}`);
    }

    try {
        const pageHost = new URL(pageUrl).hostname;
        const canonicalHost = new URL(resolvedUrl).hostname;
        if (canonicalHost !== pageHost) {
            issues.push(`Canonical points to a different domain (${canonicalHost}).`);
        }
    } catch (err) {
        issues.push(`Failed to parse domains: ${err.message}`);
    }

    // Only fetch if canonical exists
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
        canonicalTag: {
            url: resolvedUrl,
            statusCode: canonicalUrlStatusCode,
            isSelfReferential,
            issues,
        }
    };
}
