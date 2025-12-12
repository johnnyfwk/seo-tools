import { browserHeaders } from "./browserHeaders";

export async function checkRobotsTxt(inputUrl, userAgent = "*") {
    try {
        const urlObj = new URL(inputUrl);

        // Normalize host without "www."
        const bareHost = urlObj.hostname.replace(/^www\./, "");

        // Generate all likely robots.txt URLs
        const robotsCandidates = [
            `https://${bareHost}/robots.txt`,
            `https://www.${bareHost}/robots.txt`,
            `http://${bareHost}/robots.txt`,
            `http://www.${bareHost}/robots.txt`,
        ];

        let robotsTxtUrl = null;
        let text = null;

        // Try candidates in order until one succeeds
        for (const candidate of robotsCandidates) {
            try {
                const res = await fetch(candidate, {
                    redirect: "follow",
                    headers: browserHeaders
                });

                if (res.ok) {
                    // Always try to read it — almost all robots.txt are plain text even if content-type is wrong
                    const body = await res.text();

                    // Simple sanity check: must at least contain User-agent or Sitemap
                    if (body.length > 0) {
                        text = body;
                        robotsTxtUrl = candidate;
                        break;
                    }
                }

            } catch (e) {
                // continue to next candidate
            }
        }

        // If none worked → treat robots.txt as missing
        if (!text) {
            return {
                url: null,
                exists: false,
                blocked: null,
                allowRules: [],
                disallowRules: [],
                sitemaps: [],
            };
        }

        // --- PARSE ROBOTS.TXT ---
        const lines = text.split("\n");

        const groups = [];
        const sitemaps = [];
        let currentGroup = null;

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith("#")) continue;

            const lower = line.toLowerCase();

            if (lower.startsWith("sitemap:")) {
                let rawUrl = line.replace(/^sitemap:\s*/i, "").trim();
                if (!/^https?:\/\//i.test(rawUrl)) {
                    rawUrl = new URL(rawUrl, robotsTxtUrl).href;
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

        // --- RULE MATCHING ---
        const uaLower = userAgent.toLowerCase();

        const matchedGroup =
            groups.find(g => g.userAgents.includes(uaLower)) ||
            groups.find(g => g.userAgents.includes("*")) ||
            { allow: [], disallow: [] };

        const allowRules = matchedGroup.allow;
        const disallowRules = matchedGroup.disallow;

        const pathWithQuery = urlObj.pathname + urlObj.search;

        const matchesRule = (rule, path) => {
            if (!rule || rule === "") return false;

            // Escape regex special chars except * and $
            let pattern = rule
                .replace(/[.+^${}()|[\]\\]/g, "\\$&")
                .replace(/\*/g, ".*");

            // '^' anchor if rule doesn’t start with *
            if (!rule.startsWith("*")) pattern = "^" + pattern;

            // If rule ends with '$', ensure correct end anchor
            if (rule.endsWith("$")) {
                pattern = pattern.replace(/\\\$$/, "") + "$";
            }

            return new RegExp(pattern).test(path);
        };

        const matchedAllow = allowRules.filter(r => matchesRule(r, pathWithQuery));
        const matchedDisallow = disallowRules.filter(r => matchesRule(r, pathWithQuery));

        const longestAllow = matchedAllow.sort((a, b) => b.length - a.length)[0] || null;
        const longestDisallow =
            matchedDisallow.sort((a, b) => b.length - a.length)[0] || null;

        let blocked = false;
        let blockingRule = null;

        if (longestDisallow) {
            blocked = true;
            blockingRule = {
                type: 'Disallow',
                rule: longestDisallow
            };
        };

        if (longestAllow && (!longestDisallow || longestAllow.length >= longestDisallow.length)) {
            blocked = false;
            blockingRule = { type: 'Allow', rule: longestAllow };
        }

        const sitemapResults = [];

        for (const sitemapUrl of sitemaps) {
            try {
                const res = await fetch(sitemapUrl, {
                    method: "GET",
                    redirect: "follow",
                    headers: browserHeaders
                });

                sitemapResults.push({
                    url: sitemapUrl,
                    statusCode: res.status,
                });

            } catch (err) {
                sitemapResults.push({
                    url: sitemapUrl,
                    statusCode: null,
                    error: err.message
                });
            }
        }

        return {
            url: robotsTxtUrl,
            exists: true,
            blocked,
            determiningRule: blockingRule,
            sitemaps: sitemapResults,
        };
    } catch (err) {
        return {
            url: null,
            exists: false,
            blocked: null,
            allowRules: [],
            disallowRules: [],
            sitemaps: [],
        };
    }
}

