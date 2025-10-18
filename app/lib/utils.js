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