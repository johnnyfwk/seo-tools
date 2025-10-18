async function fetchRobotsTxt(url) {
    try {
        const { origin } = new URL(url);
        const robotsUrl = `${origin}/robots.txt`;

        const res = await fetch(robotsUrl, { redirect: 'follow' });

        if (!res.ok) {
            return { content: null, url, exists: false };
        }

        const text = await res.text();

        return { content: text, url, exists: true };
    } catch (err) {
        return { content: null, url: null, exists: false, error: err.message };
    }
}

function parseRobotsTxt(content) {
    const lines = content.split(/\r?\n/).map(l => l.trim());
    const rules = {};
    let currentAgent = null;

    for (const line of lines) {
        if (!line || line.startsWith('#')) continue;

        const [rawKey, rawValue] = line.split(':', 2);

        if (!rawKey || rawValue === undefined) continue;

        const key = rawKey.trim().toLowerCase();
        const value = rawValue.trim();

        if (key === 'user-agent') {
            currentAgent = value.toLowerCase();
            if (!rules[currentAgent]) rules[currentAgent] = { disallow: [], allow: [] };
        } else if (key === 'disallow' && currentAgent) {
            rules[currentAgent].disallow.push(value);
        } else if (key === 'allow' && currentAgent) {
            rules[currentAgent].allow.push(value);
        }
    }

    return rules;
}

// Convert robots.txt path rule → regex
function ruleToRegex(rule) {
    if (rule === '') return null; // empty disallow = allow all

    let regex = rule
        // Escape regex special characters EXCEPT "*"
        .replace(/([.+?^=!:${}()|[\]\\])/g, '\\$1')
        // Convert * to .*
        .replace(/\*/g, '.*');

    // Handle $ anchor at end
    if (regex.endsWith('$')) {
        // Already valid
    } else if (regex.endsWith('\\$')) {
        regex = regex.slice(0, -2) + '$';
    }

    return new RegExp(`^${regex}`);
}

function isAllowedByRobots(url, userAgent, rules) {
    const u = new URL(url);
    const pathAndQuery = u.pathname + (u.search || ''); // 👈 include query string

    const ua = userAgent.toLowerCase();
    const uaRules = rules[ua] || rules['*'] || { disallow: [], allow: [] };

    const allowRegex = uaRules.allow.map(ruleToRegex).filter(Boolean);
    const disallowRegex = uaRules.disallow.map(ruleToRegex).filter(Boolean);

    // Check allows
    for (const re of allowRegex) {
        if (re.test(pathAndQuery)) return true;
    }

    // Check disallows
    for (const re of disallowRegex) {
        if (re.test(pathAndQuery)) return false;
    }

    return true;
}

async function checkRobotsTxt(url, userAgent = '*') {
    const robots = await fetchRobotsTxt(url);

    if (!robots.exists) {
        return { allowed: true, reason: 'No robots.txt found', url: robots.url };
    }

    const rules = parseRobotsTxt(robots.content);
    const allowed = isAllowedByRobots(url, userAgent, rules);

    return {
        allowed,
        url: robots.url,
        reason: allowed
            ? 'URL allowed by robots.txt'
            : 'URL blocked from crawling by robots.txt (not indexable via content)'
    };
}

export { checkRobotsTxt };