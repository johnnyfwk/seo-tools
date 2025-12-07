export function validateUrlFrontend(inputUrl) {
    const trimmedUrl = inputUrl.trim();

    // 1. Reject clearly invalid protocols (htps://, htp://, ftp:// etc.)
    if (/^[a-zA-Z]+:\/\//.test(trimmedUrl)) {
        if (!/^https?:\/\//i.test(trimmedUrl)) {
            return {
                valid: false,
                error: "Invalid protocol. Use http:// or https:// only."
            };
        }
    }

    // 2. If no protocol → add http://
    const withProtocol = /^https?:\/\//i.test(trimmedUrl)
        ? trimmedUrl
        : "http://" + trimmedUrl;

    // 3. Try URL parsing (this catches 'http://????', 'http://htps://', etc.)
    let url;
    try {
        url = new URL(withProtocol);
    } catch {
        return {
            valid: false,
            error: "Invalid URL format"
        };
    }

    // 4. Reject URLs without a real hostname
    if (!url.hostname.includes(".") || url.hostname.length < 3) {
        return {
            valid: false,
            error: "Invalid URL"
        };
    }

    // 5. Reject obviously incorrect domains (numbers only, one letter, etc.)
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

    // Domain must contain at least one dot
    if (!hostname.includes(".")) {
        return {
            valid: false,
            error: "URL must contain a valid domain (e.g. example.com)"
        };
    }

    // Only valid characters
    if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
        return {
            valid: false,
            error: "Domain contains invalid characters"
        };
    }

    // Hyphen rules
    if (hostname.startsWith("-") || hostname.endsWith("-")) {
        return {
            valid: false,
            error: "Domain cannot start or end with a hyphen"
        };
    }

    // No double dots
    if (hostname.includes("..")) {
        return {
            valid: false,
            error: "Domain contains invalid formatting"
        };
    }

    // Top-level domain rules
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
                <span style={{ background: "yellow" }}>
                    {"␣".repeat(leading.length)}
                </span>
            )}
            {core}
            {trailing && (
                <span style={{ background: "yellow" }}>
                    {"␣".repeat(trailing.length)}
                </span>
            )}
        </>
    );
}

export function normaliseUrl(url) {
    try {
        const u = new URL(url.trim());

        // Lowercase hostname (domains are case-insensitive)
        u.hostname = u.hostname.toLowerCase();

        // Remove hash (#fragment) and query parameters (?utm= etc.)
        u.hash = "";
        u.search = "";

        // Remove trailing slash unless it's the root
        if (u.pathname.endsWith("/") && u.pathname !== "/") {
            u.pathname = u.pathname.slice(0, -1);
        }

        return u.href;
    } catch {
        return url.trim();
    }
}

// NEW: normalizer that PRESERVES the query/search for canonical comparison
export function normaliseUrlKeepSearch(url) {
    try {
        const u = new URL(url.trim());
        u.hostname = u.hostname.toLowerCase();
        u.hash = ""; // keep search but remove fragment
        // leave u.search intact (do NOT clear)
        if (u.pathname.endsWith("/") && u.pathname !== "/") {
            u.pathname = u.pathname.slice(0, -1);
        }
        // return full href including search
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
 * Evaluate if a URL is indexable.
 * @param {Object} params
 * @param {number} params.statusCode - Final HTTP status code of the URL
 * @param {boolean} params.blockedByRobots - True if URL is blocked by robots.txt
 * @param {boolean} params.canonicalMatches - True if canonical URL matches this URL
 * @param {boolean} params.metaRobotsAllowsIndexing - True if meta robots allows indexing
 * @returns {Object} { indexable: boolean, reasons: string[] }
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
            reasons: ["Insufficient data (missing status code or content type)"]
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
            reasons.push("Meta robots tag has 'noindex' value");
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
    if (statusCode >= 200 && statusCode < 300) return "success-background";
    if (statusCode >= 300 && statusCode < 400) return "warning-background";
    if (statusCode === 404 || statusCode === 410) return "error-background";
    if (statusCode >= 400 && statusCode < 500) return "error-background";
    if (statusCode >= 500 && statusCode < 600) return "server-error-background";
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

export function getSlugFromFile(importMetaUrl) {
    const path = new URL(importMetaUrl).pathname;

    return (
        path
            .split("/app/")[1]
            .replace("/page.js", "")
    );
}