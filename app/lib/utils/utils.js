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
    metaRobotsAllowsIndexing
}) {
    const reasons = [];
    let indexable = true;

    if (statusCode !== 200) {
        indexable = false;
        reasons.push(`Non-200 final status (${statusCode})`);
    }

    if (blockedByRobots === true) {
        indexable = false;
        reasons.push("Blocked by robots.txt");
    }

    if (metaRobotsAllowsIndexing === false) {
        indexable = false;
        reasons.push("Meta robots: noindex");
    }

    if (canonicalMatches === false) {
        indexable = false;
        reasons.push("Canonical URL points elsewhere");
    }

    return { indexable, reasons };
}

export function getInitialUrlStatusCodeClass(statusCode) {
    if (!statusCode) return "";
    if (statusCode >= 200 && statusCode < 300) return "success-background";
    if (statusCode >= 300 && statusCode < 400) return "warning-background";
    return "error-background"; // 400/500
}

export function getFinalUrlStatusCodeTextAndClass(initialStatusCode, finalStatusCode) {
    // No redirect → hide final info
    if (initialStatusCode >= 200 && initialStatusCode < 300) {
        return { text: "-", class: "" };
    }

    // No final status → fetch error
    if (!finalStatusCode) {
        return { text: "N/A", class: "" };
    }

    // Good final
    if (finalStatusCode >= 200 && finalStatusCode < 300) {
        return { text: finalStatusCode, class: "success-background" };
    }

    // Redirect
    if (finalStatusCode >= 300 && finalStatusCode < 400) {
        return { text: finalStatusCode, class: "warning-background" };
    }

    // Error
    return { text: finalStatusCode, class: "error-background" };
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
