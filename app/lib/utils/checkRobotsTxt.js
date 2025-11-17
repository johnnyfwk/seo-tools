export async function checkRobotsTxt(url, userAgent = "*") {
    try {
        const { origin } = new URL(url);

        const urlObj = new URL(url);
        const robotsTxtUrl = urlObj.origin.startsWith("https://")
            ? urlObj.origin + "/robots.txt"
            : "https://" + urlObj.hostname + "/robots.txt";
        const pathWithQuery = urlObj.pathname + urlObj.search;

        const response = await fetch(robotsTxtUrl, { redirect: "follow" });

        if (!response.ok) {
            return {
                url: robotsTxtUrl,
                exists: false,
                blocked: false,
                allowRules: [],
                disallowRules: [],
                sitemaps: [],
            };
        }

        const text = await response.text();
        const lines = text.split("\n");

        const sitemaps = [];
        const groups = [];
        let currentGroup = null;

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith("#")) continue;

            const lower = line.toLowerCase();

            if (lower.startsWith("sitemap:")) {
                // Extract everything after 'Sitemap:'
                let rawUrl = line.replace(/^sitemap:\s*/i, "").trim();

                // Only prepend origin if it’s relative
                if (!/^https?:\/\//i.test(rawUrl)) {
                    rawUrl = new URL(rawUrl, origin).href;
                }

                sitemaps.push(rawUrl);
                continue;
            }

            if (lower.startsWith("user-agent:")) {
                const ua = line.split(":")[1].trim().toLowerCase();
                currentGroup = { userAgents: [ua], allow: [], disallow: [] };
                groups.push(currentGroup);
                continue;
            }

            if (!currentGroup) continue;

            if (lower.startsWith("allow:")) {
                currentGroup.allow.push(line.split(":")[1].trim());
                continue;
            }

            if (lower.startsWith("disallow:")) {
                currentGroup.disallow.push(line.split(":")[1].trim());
                continue;
            }
        }

        const uaLower = userAgent.toLowerCase();

        // Find the group matching the user-agent or '*'
        const matchedGroup =
            groups.find(g => g.userAgents.includes(uaLower)) ||
            groups.find(g => g.userAgents.includes("*")) ||
            { allow: [], disallow: [] };

        const { allow: allowRules, disallow: disallowRules } = matchedGroup;

        const matchesRule = (rule, path) => {
            if (!rule) return false; // empty disallow = allow everything
            let regex = rule
                .replace(/\*/g, ".*")   // wildcard
                .replace(/\?/g, "\\?"); // literal ?

            if (!rule.startsWith("*")) regex = "^" + regex;

            if (rule.endsWith("$")) {
                regex = regex.replace(/\$$/, "") + "$";
            }

            return new RegExp("^" + regex).test(path);
        };

        const matchedAllow = allowRules.filter(r => matchesRule(r, pathWithQuery));
        const matchedDisallow = disallowRules.filter(r => matchesRule(r, pathWithQuery));

        // longest match wins
        const longestAllow = matchedAllow.sort((a, b) => b.length - a.length)[0] || null;
        const longestDisallow = matchedDisallow.sort((a, b) => b.length - a.length)[0] || null;

        let blocked = false;
        if (longestDisallow) blocked = true;
        if (longestAllow && (!longestDisallow || longestAllow.length >= longestDisallow.length)) blocked = false;

        return {
            url: robotsTxtUrl,
            exists: true,
            blocked,
            allowRules,
            disallowRules,
            sitemaps,
        };
    } catch (err) {
        return {
            url: null,
            exists: false,
            blocked: false,
            allowRules: [],
            disallowRules: [],
            sitemaps: [],
        };
    }
}
