import * as utils from '@/app/lib/utils/utils';
import { browserHeaders } from '../utils/browserHeaders';

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

    const tags = [];

    for (const originalUrl of canonicalUrls) {
        let resolvedCanonicalUrl;
        let resolvedCanonicalUrlStatusCode = null;
        let resolvedCanonicalUrlMatchesOriginalUrl = null;
        const issues = [];

        let canonicalUrlValid = true;

        try {
            resolvedCanonicalUrl = new URL(originalUrl, pageUrl).href;
        } catch {
            canonicalUrlValid = false;
            resolvedCanonicalUrl = originalUrl;
            issues.push(`Invalid canonical URL format: ${originalUrl}`);
        }

        if (resolvedCanonicalUrl) {
            const pageUrlObj = new URL(pageUrl);
            const canonicalObj = new URL(resolvedCanonicalUrl);

            let pageUrlForComparison = new URL(pageUrlObj.href);

            const pageParam = pageUrlObj.searchParams.get("page");

            if (pageParam === "1") {
                pageUrlForComparison.searchParams.delete("page");
            }

            resolvedCanonicalUrlMatchesOriginalUrl =
                utils.normaliseUrlKeepSearch(canonicalObj.href) ===
                utils.normaliseUrlKeepSearch(pageUrlForComparison.href);
                
            if (!resolvedCanonicalUrlMatchesOriginalUrl) {
                issues.push(`Canonical URL points elsewhere: ${resolvedCanonicalUrl}`)
            };
        }

        try {
            if (resolvedCanonicalUrl && canonicalUrlValid) {
                let response;

                try {
                    response = await fetch(resolvedCanonicalUrl, {
                        method: 'HEAD',
                        headers: browserHeaders,
                        redirect: 'manual',
                    });
                } catch {
                    response = await fetch(resolvedCanonicalUrl, {
                        method: 'GET',
                        headers: browserHeaders,
                        redirect: 'manual',
                    });
                }

                resolvedCanonicalUrlStatusCode = response.status;

                if (resolvedCanonicalUrlStatusCode >= 300 && resolvedCanonicalUrlStatusCode < 400) {
                    issues.push(`Canonical URL redirects (${resolvedCanonicalUrlStatusCode}) Generally OK, but Google may treat final URL as canonical.`)
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
