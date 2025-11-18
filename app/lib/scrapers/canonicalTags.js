import * as utils from '@/app/lib/utils/utils';

export async function scrapeCanonicalTags($, pageUrl) {
    const globalIssues = [];

    if (!pageUrl) {
        globalIssues.push("Missing page URL parameter.");
        return {
            canonicalTags: {
                tags: [],
                globalIssues,
            }
        };
    }

    const canonicalUrls = $('link[rel="canonical"]')
        .map((_, el) => $(el).attr('href')?.trim())
        .get()
        .filter(Boolean);

    if (canonicalUrls.length === 0) {
        globalIssues.push("No canonical tag found.");
    }

    if (canonicalUrls.length > 1) {
        globalIssues.push(`Multiple canonical tags found (${canonicalUrls.length}). Search engines typically ignore all or the first one.`);
    }

    const defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0; +https://example.com/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
    };

    const tags = [];

    for (const originalUrl of canonicalUrls) {
        let resolvedCanonicalUrl;
        let resolvedCanonicalUrlStatusCode = null;
        let resolvedCanonicalUrlMatchesOriginalUrl = null;
        const issues = [];

        try {
            resolvedCanonicalUrl = new URL(originalUrl, pageUrl).href;
        } catch {
            resolvedCanonicalUrl = originalUrl;
            issues.push(`Invalid canonical URL format: ${originalUrl}`);
        }

        if (resolvedCanonicalUrl) {
            resolvedCanonicalUrlMatchesOriginalUrl = 
                utils.normaliseUrlKeepSearch(resolvedCanonicalUrl) === utils.normaliseUrlKeepSearch(pageUrl);
            if (!resolvedCanonicalUrlMatchesOriginalUrl) {
                issues.push(`Canonical URL points elsewhere: ${resolvedCanonicalUrl}`)
            };
        }

        try {
            if (resolvedCanonicalUrl && !issues.includes(`Invalid canonical URL format: ${originalUrl}`)) {
                const response = await fetch(resolvedCanonicalUrl, {
                    method: 'HEAD',
                    headers: defaultHeaders,
                    redirect: 'manual',
                });

                resolvedCanonicalUrlStatusCode = response.status;

                if (resolvedCanonicalUrlStatusCode >= 300 && resolvedCanonicalUrlStatusCode < 400) {
                    issues.push(`Canonical URL redirects (${resolvedCanonicalUrlStatusCode}) Recommended: 200 OK.`)
                } else if (resolvedCanonicalUrlStatusCode >= 400) {
                    issues.push(`Canonical URL returns error (${resolvedCanonicalUrlStatusCode}). Recommended: 200 OK.`)
                };
            }
        } catch (err) {
            issues.push(`Failed to fetch canonical URL: ${err.message}`);
        }

        tags.push({
            originalUrl,
            resolvedCanonicalUrl,
            resolvedCanonicalUrlStatusCode,
            resolvedCanonicalUrlMatchesOriginalUrl,
            issues
        });
    }

    return {
        canonicalTags: {
            tags,
            globalIssues,
        }
    };
}
