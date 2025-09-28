import { scrapeWithCheerio } from '@/app/lib/scrapers';

async function fetchRedirectChain(url) {
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

export async function POST(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return new Response(
                JSON.stringify({ error: 'No URL provided.' }),
                { status: 400 }
            );
        }

        // Fetch redirect chain first
        const redirectChain = await fetchRedirectChain(url);
        const finalUrl = redirectChain[redirectChain.length - 1]?.url || url;
        const statusCode = redirectChain[0]?.statusCode || null;

        let scraped = {};

        // Only fetch HTML if the final URL returns 200
        if (statusCode === 200) {
            try {
                const response = await fetch(finalUrl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.9",
                    },
                    redirect: 'follow',
                });

                if (response.ok) {
                    const html = await response.text();
                    scraped = await scrapeWithCheerio(html, finalUrl);
                }
            } catch {
                console.error(`Failed to fetch HTML for ${finalUrl}:`, err.message);
            }
        }

        return new Response(
            JSON.stringify({
                statusCode,
                finalUrl,
                redirectChain,
                ...scraped,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
