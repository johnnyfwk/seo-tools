import { scrapeWithCheerio } from '@/app/lib/scrapers';
import { checkRobotsTxt } from '@/app/lib/scrapers/robotsTxt';

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
        // const { url } = await req.json();
        let { url } = await req.json();
        url = url.trim();

        if (!/^https?:\/\//i.test(url)) {
            url = 'http://' + url; // fallback if user types "example.com"
        }

        if (!url) {
            return new Response(
                JSON.stringify({ error: 'No URL provided.' }),
                { status: 400 }
            );
        }

        try {
            new URL(url);
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid URL.' }), { status: 400 });
        }

        // 1. Build the redirect chain
        const redirectChain = await fetchRedirectChain(url);

        const firstRedirectUrl = redirectChain[0]?.url || '';
        const secondRedirectUrl = redirectChain[1]?.url || '';
        const redirectsToHttps = firstRedirectUrl.startsWith('http://') && secondRedirectUrl?.startsWith('https://');

        // 2. Identify entered status + final URL
        const enteredUrlStatusCode = redirectChain[0]?.statusCode || null;
        const finalEntry = redirectChain[redirectChain.length - 1] || {};
        const finalUrl = finalEntry.url || url;
        const finalUrlStatusCode = finalEntry.statusCode || null;

        const robotsCheck = await checkRobotsTxt(finalUrl, '*');

        let scraped = {};

        // 3. Only scrape if the final status is 200
        if (enteredUrlStatusCode === 200) {
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
                    const headersObj = Object.fromEntries(response.headers.entries()); // convert Headers to plain object
                    scraped = await scrapeWithCheerio(html, finalUrl, headersObj);
                }
            } catch (err) {
                console.error(`Failed to fetch HTML for ${finalUrl}:`, err.message);
            }
        }

        return new Response(
            JSON.stringify({
                enteredUrl: url,
                enteredUrlStatusCode,   // status of the URL the user typed
                finalUrl,        // last URL after redirects
                finalUrlStatusCode,     // last status
                redirectChain,   // full chain with {url, statusCode}
                redirectsToHttps,
                robotsCheck,
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

