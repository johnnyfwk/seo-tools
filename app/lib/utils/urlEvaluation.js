import { checkRobotsTxt } from "../scrapers/robotsTxt";

export async function urlEvaluation(enteredUrl, userAgent = "SEO-Checker") {
    let normalisedUrl = enteredUrl;

    // Ensure URL starts with http/https
    if (!/^https?:\/\//i.test(normalisedUrl)) {
        normalisedUrl = "http://" + normalisedUrl;
    }

    try {
        new URL(normalisedUrl);
    } catch {
        return {
            baseUrlEvaluation: {
                enteredUrl,
                normalisedUrl,
                finalUrl: enteredUrl,
                redirectChain: [],
                robotsTxt: null,
                enteredUrlStatusCode: null,
                finalUrlStatusCode: null,
                shouldScrape: false,
                reason: "❌ Invalid URL format"
            }
        };
    }

    // -----------------------
    // Handle redirects
    // -----------------------
    const redirectChain = [];
    let currentUrl = normalisedUrl;
    const maxRedirects = 10;
    let redirectCount = 0;

    while (currentUrl && redirectCount < maxRedirects) {
        try {
            const res = await fetch(currentUrl, {
                method: "GET",
                redirect: "manual",
                headers: {
                    "User-Agent": userAgent,
                    "Accept": "text/html",
                },
            });

            redirectChain.push({
                url: currentUrl,
                statusCode: res.status,
            });

            const location = res.headers.get("location");

            if (location) {
                currentUrl = new URL(location, currentUrl).href;
                redirectCount++;
            } else {
                currentUrl = null;
            }
        } catch (err) {
            redirectChain.push({
                url: currentUrl,
                statusCode: null,
                fetchError: err.message,
            });

            return {
                baseUrlEvaluation: {
                    enteredUrl,
                    normalisedUrl,
                    finalUrl: currentUrl,
                    redirectChain,
                    enteredUrlStatusCode: redirectChain[0]?.statusCode ?? null,
                    finalUrlStatusCode: null,
                    enteredUrlFetchError: err.message,
                    finalUrlFetchError: err.message,
                    robotsTxt: null,
                    shouldScrape: false,
                    reason: `❌ Failed to fetch URL: ${err.message}`
                }
            };
        }
    }

    const enteredUrlStatusCode = redirectChain[0]?.statusCode ?? null;
    const finalEntry = redirectChain[redirectChain.length - 1] || {};
    const finalUrl = finalEntry.url ?? normalisedUrl;
    const finalUrlStatusCode = finalEntry.statusCode ?? null;
    const enteredUrlFetchError = redirectChain[0]?.fetchError || null;
    const finalUrlFetchError = finalEntry?.fetchError || null;

    if (enteredUrlFetchError) {
        return {
            baseUrlEvaluation: {
                enteredUrl,
                normalisedUrl,
                finalUrl,
                redirectChain,
                enteredUrlStatusCode,
                finalUrlStatusCode,
                enteredUrlFetchError,
                finalUrlFetchError,
                robotsTxt: null,
                shouldScrape: false,
                reason: `❌ Failed to fetch URL: ${enteredUrlFetchError}`
            }
        };
    }

    if (enteredUrlStatusCode !== 200) {
        return {
            baseUrlEvaluation: {
                enteredUrl,
                normalisedUrl,
                finalUrl,
                redirectChain,
                enteredUrlStatusCode,
                finalUrlStatusCode,
                enteredUrlFetchError,
                finalUrlFetchError,
                robotsTxt: null,
                shouldScrape: false,
                reason: `❌ URL returned a non-200 status code (${enteredUrlStatusCode})`
            }
        };
    }

    if (redirectChain.length > 1) {
        return {
            baseUrlEvaluation: {
                enteredUrl,
                normalisedUrl,
                finalUrl,
                redirectChain,
                enteredUrlStatusCode,
                finalUrlStatusCode,
                enteredUrlFetchError,
                finalUrlFetchError,
                robotsTxt: null,
                shouldScrape: false,
                reason: `❌ URL redirected from ${enteredUrl} → ${finalUrl}. Scraping allowed only for the entered URL.`
            }
        };
    }

    // -----------------------
    // Check robots.txt using improved function
    // -----------------------
    const robots = await checkRobotsTxt(finalUrl, userAgent);

    if (!robots.allowed) {
        return {
            baseUrlEvaluation: {
                enteredUrl,
                normalisedUrl,
                finalUrl,
                redirectChain,
                enteredUrlStatusCode,
                finalUrlStatusCode,
                enteredUrlFetchError,
                finalUrlFetchError,
                robotsTxt: robots,
                shouldScrape: false,
                reason: `❌ Blocked by robots.txt (${robots.reason})`
            }
        };
    }

    // -----------------------
    // All checks passed
    // -----------------------
    return {
        baseUrlEvaluation: {
            enteredUrl,
            normalisedUrl,
            finalUrl,
            redirectChain,
            enteredUrlStatusCode,
            finalUrlStatusCode,
            enteredUrlFetchError,
            finalUrlFetchError,
            robotsTxt: robots,
            shouldScrape: true,
            reason: "✅ URL is valid and allowed to be scraped."
        }
    };
}
