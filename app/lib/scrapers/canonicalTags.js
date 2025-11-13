import * as utils from '@/app/lib/utils/utils';

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

    const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://example.com/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
    };

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
            resolvedUrlMatchesOriginalUrl = utils.normaliseUrlKeepSearch(resolvedUrl) === utils.normaliseUrlKeepSearch(pageUrl);
            if (!resolvedUrlMatchesOriginalUrl) issues.push(`Canonical URL points elsewhere: ${resolvedUrl}`);
        }

        let resolvedUrlStatusCode = null;
        try {
            if (resolvedUrl) {
                const res = await fetch(resolvedUrl, {
                    method: 'HEAD',
                    headers: defaultHeaders,
                });
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
