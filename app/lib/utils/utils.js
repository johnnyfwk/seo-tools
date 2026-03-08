export function validateUrlFrontend(inputUrl) {
    const trimmedUrl = inputUrl.trim();

    if (/^[a-zA-Z]+:\/\//.test(trimmedUrl)) {
        if (!/^https?:\/\//i.test(trimmedUrl)) {
            return {
                valid: false,
                error: "Invalid protocol. Use http:// or https:// only."
            };
        }
    }

    const withProtocol = /^https?:\/\//i.test(trimmedUrl)
        ? trimmedUrl
        : "http://" + trimmedUrl;

    let url;
    try {
        url = new URL(withProtocol);
    } catch {
        return {
            valid: false,
            error: "Invalid URL format"
        };
    }

    if (!url.hostname.includes(".") || url.hostname.length < 3) {
        return {
            valid: false,
            error: "Invalid URL"
        };
    }

    if (!/^[a-z0-9.-]+$/i.test(url.hostname)) {
        return {
            valid: false,
            error: "Domain name contains invalid characters"
        };
    }

    return {
        valid: true,
        url: url.href
    };
}

export function validateUrlBackend(inputUrl) {
    if (!inputUrl) {
        return {
            valid: false,
            error: "URL is required"
        };
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(inputUrl);
    } catch {
        return {
            valid: false,
            error: "Invalid URL format"
        };
    }

    const hostname = parsedUrl.hostname;

    if (!hostname.includes(".")) {
        return {
            valid: false,
            error: "URL must contain a valid domain (e.g. example.com)"
        };
    }

    if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
        return {
            valid: false,
            error: "Domain contains invalid characters"
        };
    }

    if (hostname.startsWith("-") || hostname.endsWith("-")) {
        return {
            valid: false,
            error: "Domain cannot start or end with a hyphen"
        };
    }

    if (hostname.includes("..")) {
        return {
            valid: false,
            error: "Domain contains invalid formatting"
        };
    }

    const tld = hostname.split(".").pop();
    if (tld.length < 2) {
        return {
            valid: false,
            error: "Invalid top-level domain"
        };
    }

    return {
        valid: true,
        url: parsedUrl.href
    };
}

export function highlightWhitespace(str) {
    if (!str) return str;

    const leadingMatch = str.match(/^(\s+)/);
    const trailingMatch = str.match(/(\s+)$/);

    const leading = leadingMatch ? leadingMatch[0] : "";
    const trailing = trailingMatch ? trailingMatch[0] : "";

    const core = str.substring(leading.length, str.length - trailing.length);

    return (
        <>
            {leading && (
                <span className="highlight-whitespace-background">
                    {"␣".repeat(leading.length)}
                </span>
            )}
            {core}
            {trailing && (
                <span className="highlight-whitespace-background">
                    {"␣".repeat(trailing.length)}
                </span>
            )}
        </>
    );
}

export function normaliseUrl(url) {
    try {
        const u = new URL(url.trim());

        u.hostname = u.hostname.toLowerCase();

        u.hash = "";
        u.search = "";

        if (u.pathname.endsWith("/") && u.pathname !== "/") {
            u.pathname = u.pathname.slice(0, -1);
        }

        return u.href;
    } catch {
        return url.trim();
    }
}

export function normaliseUrlKeepSearch(url) {
    try {
        const u = new URL(url.trim());
        u.hostname = u.hostname.toLowerCase();
        u.hash = "";
        if (u.pathname.endsWith("/") && u.pathname !== "/") {
            u.pathname = u.pathname.slice(0, -1);
        }
        return u.href;
    } catch {
        return url.trim();
    }
}

export async function fetchRedirectChain(url) {
    const chain = [];
    let currentUrl = url;

    while (currentUrl) {
        try {
            const res = await fetch(currentUrl, { method: 'HEAD', redirect: 'manual' });
            const statusCode = res.status;
            chain.push({ url: currentUrl, statusCode });

            const location = res.headers.get('location');
            currentUrl = location ? new URL(location, currentUrl).href : null;
        } catch {
            chain.push({ url: currentUrl, statusCode: "Could not fetch status code" });
            currentUrl = null;
        }
    }

    return chain;
}

export function createLimiter(maxConcurrency) {
    const queue = [];
    let activeCount = 0;

    const next = () => {
        if (queue.length === 0 || activeCount >= maxConcurrency) return;
        activeCount++;
        const { fn, resolve, reject } = queue.shift();
        fn()
            .then(resolve)
            .catch(reject)
            .finally(() => {
                activeCount--;
                next();
            });
    };

    return function limit(fn) {
        return new Promise((resolve, reject) => {
            queue.push({ fn, resolve, reject });
            process.nextTick(next);
        });
    };
}

/**
 * @param {Object} params
 * @param {number} params.statusCode
 * @param {boolean} params.blockedByRobots
 * @param {boolean} params.canonicalMatches
 * @param {boolean} params.metaRobotsAllowsIndexing
 * @returns {Object}
*/
export function evaluateIndexability({
    statusCode,
    blockedByRobots,
    canonicalMatches,
    metaRobotsAllowsIndexing,
    contentType,
    xRobotsNoindex
}) {
    const reasons = [];

    if (statusCode == null || contentType == null) {
        return {
            indexable: null,
            reasons: ["Insufficient data to determine indexability"]
        };
    }

    let indexable = true;

    if (statusCode < 200 || statusCode >= 300) {
        indexable = false;
        reasons.push(`HTTP status code is ${statusCode} (not indexable)`);
        return { indexable, reasons };
    }

    if (blockedByRobots === true) {
        indexable = false;
        reasons.push("Crawling blocked by robots.txt");
    }

    if (typeof xRobotsNoindex === "string" &&
        xRobotsNoindex.toLowerCase().includes("noindex")
    ) {
        indexable = false;
        reasons.push("X-Robots-Tag has 'noindex' value");
    }

    const isHtml = contentType.includes("text/html");

    if (isHtml) {
        if (metaRobotsAllowsIndexing === false) {
            indexable = false;
            reasons.push("Meta robots/x-robots tag has a 'noindex' value");
        }

        if (canonicalMatches === false) {
            indexable = false;
            reasons.push("Canonical URL points to a different URL");
        }
    }

    return { indexable, reasons };
}

export function getInitialUrlStatusCodeClass(statusCode) {
    if (!statusCode) return "";
    if (statusCode === 200) return "success-background";
    if (statusCode >= 201 && statusCode < 300) return "warning-background";
    if (statusCode >= 300 && statusCode < 400) return "warning-background";
    if (statusCode >= 400 && statusCode < 500) return "error-background";
    if (statusCode >= 500) return "error-background";
    return "warning-background";
}

export function getFinalUrlStatusCodeTextAndClass(initialUrlStatusCode, finalUrlStatusCode) {
    if (initialUrlStatusCode >= 200 && initialUrlStatusCode < 300) {
        return { text: "-", class: "" };
    }

    if (initialUrlStatusCode >= 300 && initialUrlStatusCode < 400) {
        return {
            text: finalUrlStatusCode,
            class: finalUrlStatusCode >= 200 && finalUrlStatusCode < 300
                ? "success-background"
                : !finalUrlStatusCode
                    ? ""
                    : "error-background"
        };
    }

    return { text: "-", class: "" };
}

export function getRobotsTxtTextAndClass(blocked) {
    if (blocked === true) {
        return {
            text: "Yes",
            class: "error-background"
        }
    } else if (blocked === false) {
        return {
            text: "No",
            class: "success-background"
        }
    } else {
        return {
            text: "N/A",
            class: ""
        }
    }
}

export function getMetaRobotsTagTextAndClass(allowsIndexing) {
    if (allowsIndexing === true) {
        return {
            text: "Yes",
            class: "success-background"
        }
    } else if (allowsIndexing === false) {
        return {
            text: "No",
            class: "error-background"
        }
    } else {
        return {
            text: "N/A",
            class: ""
        }
    }
}

export function getCanonicalTextAndClass(canonicalUrlMatchesInitialUrl) {
    if (canonicalUrlMatchesInitialUrl === true) {
        return {
            text: "Yes",
            class: "success-background"
        }
    } else if (canonicalUrlMatchesInitialUrl === false) {
        return {
            text: "No",
            class: "error-background"
        }
    } else {
        return {
            text: "N/A",
            class: ""
        }
    }
}

export function formatScrapeDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor(ms % 1000);
    return seconds > 0 ? `${seconds}s ${milliseconds}ms` : `${milliseconds}ms`;
}

export function createMetadata(
    siteUrl,
    siteName,
    page,
    openGraphLocale,
    openGraphType,
    openGraphImage
) {
    return {
        robots: {
            index: page.robots.index,
            follow: page.robots.follow,
        },
        alternates: {
            canonical: page.canonicalUrl,
        },
        title: page.titleTag,
        description: page.metaDescription,
        openGraph: {
            title: page.titleTag,
            description: page.metaDescription,
            url: page.canonicalUrl,
            siteName,
            locale: openGraphLocale,
            type: openGraphType,
            images: [
                {
                    url: `${siteUrl}${openGraphImage}`
                }
            ],
        }
    }
}

export function generateStructuredDataForToolPages(siteUrl, siteName, tool) {
    const softwareApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "url": tool.canonicalUrl,
        "name": tool.h1,
        "description": tool.metaDescription,
        "applicationCategory": "SEOAnalysisTool",
        "operatingSystem": "Web",
        "creator": {
            "@type": "Organization",
            "name": siteName,
        },
        "offers": {
            "@type": "Offer",
            "url": tool.canonicalUrl,
            "price": "0",
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock"
        },
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "url": tool.canonicalUrl,
        "name": tool.h1,
        "description": tool.metaDescription,
        "isPartOf": {
            "@type": "WebSite",
            "name": siteName,
            "url": siteUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": siteName,
            "url": siteUrl,
        },
        "mainEntityOfPage": tool.canonicalUrl,
        "breadcrumb": {
            "@id": "#breadcrumb"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": "#breadcrumb",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": siteName,
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": tool.h1,
                "item": tool.canonicalUrl
            },
        ]
    };

    return [
        softwareApplicationSchema,
        webPageSchema,
        breadcrumbSchema
    ];
}

export function isPaginationUrl(url) {
    try {
        const u = new URL(url);
        const page = u.searchParams.get("page");

        return page && Number(page) > 1;
    } catch {
        return false;
    }
}