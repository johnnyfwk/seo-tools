import * as cheerio from 'cheerio';

async function fetchPageHtml(url) {
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html",
            },
        });

        if (!res.ok) return { error: `Failed to fetch: ${res.status}` };

        const html = await res.text();

        return { html };
    } catch (err) {
        return { error: err.message };
    }
}

function extractLinks($, src, destinationUrl) {
    return $('a[href]')
        .map((i, el) => {
            const href = $(el).attr('href')?.trim();
            if (!href) return null;

            let absoluteHref;
            try {
                absoluteHref = new URL(href, src).href;
            } catch {
                return null;
            }

            const anchor = $(el).text().trim();
            const rel = ($(el).attr('rel') || "").toLowerCase();
            const dofollow = !rel.includes("nofollow");

            return {
                href: absoluteHref,
                anchor,
                dofollow,
                matchesDestination: absoluteHref === destinationUrl
            };
        })
        .get()
        .filter(Boolean);
}

export async function POST(req) {
    try {
        const { destinationUrl, sourceUrls } = await req.json();

        if (!destinationUrl || !sourceUrls || !Array.isArray(sourceUrls)) {
            return new Response(
                JSON.stringify({ error: 'Provide a destination URL and one or more source URLs' }),
                { status: 400 }
            );
        }

        const results = [];

        for (const src of sourceUrls) {
            const { html, error } = await fetchPageHtml(src);

            if (error) {
                results.push({ sourceUrl: src, error });
                continue;
            }

            const $ = cheerio.load(html);

            const links = extractLinks($, src, destinationUrl);

            const matchingLinks = links.filter(link => link.matchesDestination);

            results.push({
                sourceUrl: src,
                hasLink: matchingLinks.length > 0,
                links: matchingLinks // includes href, anchor, dofollow
            });
        }

        return new Response(JSON.stringify({ destinationUrl, results }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}