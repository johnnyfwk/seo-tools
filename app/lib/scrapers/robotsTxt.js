// async function fetchRobotsTxt(url) {
//     let robotsUrl = null;
//     try {
//         const { origin } = new URL(url);
//         robotsUrl = `${origin}/robots.txt`;

//         const res = await fetch(robotsUrl, { redirect: 'follow' });

//         if (!res.ok) {
//             return { content: null, robotsUrl, exists: false };
//         }

//         const text = await res.text();
//         return { content: text, robotsUrl, exists: true };
//     } catch (err) {
//         return { content: null, robotsUrl, exists: false, error: err.message };
//     }
// }

// function parseRobotsTxt(content) {
//     const lines = content.split(/\r?\n/).map(l => l.trim());
//     const rules = {};
//     let currentAgent = null;

//     for (const line of lines) {
//         if (!line || line.startsWith('#')) continue;

//         const [rawKey, rawValue] = line.split(':', 2);
//         if (!rawKey || rawValue === undefined) continue;

//         const key = rawKey.trim().toLowerCase();
//         const value = rawValue.trim();

//         if (key === 'user-agent') {
//             currentAgent = value.toLowerCase();
//             if (!rules[currentAgent]) rules[currentAgent] = { disallow: [], allow: [] };
//         } else if (key === 'disallow' && currentAgent) {
//             rules[currentAgent].disallow.push(value);
//         } else if (key === 'allow' && currentAgent) {
//             rules[currentAgent].allow.push(value);
//         }
//     }

//     return rules;
// }

// function ruleToRegex(rule) {
//     if (rule === '') return null; // empty disallow = allow all
//     let regex = rule
//         .replace(/([.+?^=!:${}()|[\]\\])/g, '\\$1')
//         .replace(/\*/g, '.*');
//     if (regex.endsWith('\\$')) regex = regex.slice(0, -2) + '$';
//     return new RegExp(`^${regex}`);
// }

// function isAllowedByRobots(url, userAgent, rules) {
//     const u = new URL(url);
//     const pathAndQuery = u.pathname + (u.search || '');

//     const ua = userAgent.toLowerCase();
//     const uaRules = rules[ua] || rules['*'] || { disallow: [], allow: [] };

//     const allowRegex = uaRules.allow.map(ruleToRegex).filter(Boolean);
//     const disallowRegex = uaRules.disallow.map(ruleToRegex).filter(Boolean);

//     for (const re of allowRegex) {
//         if (re.test(pathAndQuery)) return true;
//     }

//     for (const re of disallowRegex) {
//         if (re.test(pathAndQuery)) return false;
//     }

//     return true;
// }

// async function checkRobotsTxt(url, userAgent = '*') {
//     const robots = await fetchRobotsTxt(url);

//     const robotsUrl = robots.robotsUrl || null;

//     if (!robots.exists) {
//         return { allowed: true, reason: 'No robots.txt found', robotsTxtUrl: robotsUrl };
//     }

//     const rules = parseRobotsTxt(robots.content);
//     const allowed = isAllowedByRobots(url, userAgent, rules);

//     return {
//         allowed,
//         robotsTxtUrl: robotsUrl, // always returns the actual robots.txt location
//         reason: allowed
//             ? 'URL allowed by robots.txt'
//             : 'URL blocked from crawling by robots.txt',
//     };
// }

// export { checkRobotsTxt };



export async function checkRobotsTxt(url, userAgent = "*") {
    let robotsUrl;

    try {
        const { origin } = new URL(url);
        robotsUrl = `${origin}/robots.txt`;

        const res = await fetch(robotsUrl, { redirect: "follow" });

        if (!res.ok) {
            return {
                allowed: true,
                url: robotsUrl,
                reason: "No robots.txt found",
            };
        }

        const content = await res.text();
        const rules = parseRobotsTxt(content);

        const allowed = isAllowedByRobots(url, userAgent, rules);

        return {
            allowed,
            url: robotsUrl,
            reason: allowed
                ? "URL allowed by robots.txt"
                : "URL blocked by robots.txt",
        };
    } catch (err) {
        return {
            allowed: true,
            url: robotsUrl ?? null,
            reason: "robots.txt fetch error",
            error: err.message,
        };
    }

    // -----------------------
    // Parse robots.txt into structured rules
    // -----------------------
    function parseRobotsTxt(content) {
        const lines = content.split(/\r?\n/).map(l => l.trim());
        const rules = [];
        let currentAgents = [];

        for (const line of lines) {
            if (!line || line.startsWith("#")) continue;

            const [rawKey, rawValue] = line.split(":", 2);
            if (!rawKey || !rawValue) continue;

            const key = rawKey.toLowerCase().trim();
            const value = rawValue.trim();

            if (key === "user-agent") {
                currentAgents.push(value.toLowerCase());
            } else if (key === "allow" || key === "disallow") {
                for (const agent of currentAgents) {
                    rules.push({
                        agent,
                        type: key,
                        path: value
                    });
                }
            } else if (key === "sitemap") {
                // Optional: store sitemap info if needed
            } else {
                // Ignore other directives
            }

            // Reset agents when a new user-agent block starts
            if (key === "user-agent" && currentAgents.length > 1) {
                currentAgents = [value.toLowerCase()];
            }
        }

        return rules;
    }

    // -----------------------
    // Convert a rule to regex
    // -----------------------
    function ruleToRegex(rule) {
        if (!rule) return null;
        let regex = rule
            .replace(/([.+?^=!:${}()|[\]\\])/g, "\\$1") // escape regex special chars
            .replace(/\*/g, ".*"); // convert * to .*

        return new RegExp("^" + regex);
    }

    // -----------------------
    // Check if URL is allowed by rules
    // -----------------------
    function isAllowedByRobots(url, userAgent, rules) {
        const u = new URL(url);
        const pathAndQuery = u.pathname + u.search;

        // Match specific UA first, fallback to '*'
        const matchingRules = rules.filter(r =>
            r.agent === userAgent.toLowerCase() || r.agent === "*"
        );

        let allowMatch = null;
        let disallowMatch = null;

        for (const rule of matchingRules) {
            const re = ruleToRegex(rule.path);
            if (!re) continue;

            if (re.test(pathAndQuery)) {
                if (rule.type === "allow") {
                    // Longest allow path takes precedence
                    if (!allowMatch || rule.path.length > allowMatch.path.length) {
                        allowMatch = rule;
                    }
                } else if (rule.type === "disallow") {
                    // Longest disallow path takes precedence
                    if (!disallowMatch || rule.path.length > disallowMatch.path.length) {
                        disallowMatch = rule;
                    }
                }
            }
        }

        // Allow > Disallow precedence
        if (allowMatch) return true;
        if (disallowMatch) return false;

        return true; // allowed if no matching rules
    }
}
