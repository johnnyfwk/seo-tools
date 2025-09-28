import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';


async function scrapeWithCheerio(html) {
    const $ = cheerio.load(html);

    const metaRobotsTag = $('meta[name="robots"]').attr('content') || "";

    const canonicalUrl = $('link[rel="canonical"]').attr('href') || "";

    const metaTitles = $('title')
        .map((i, element) => $(element).text())
        .get();

    const metaDescription = $('meta[name="description"]').attr('content') || "";

    const h1s = $('h1').map((i, element) => $(element).text()).get();
    const h2s = $('h2').map((i, element) => $(element).text()).get();
    const h3s = $('h3').map((i, element) => $(element).text()).get();
    const h4s = $('h4').map((i, element) => $(element).text()).get();
    const h5s = $('h5').map((i, element) => $(element).text()).get();
    const h6s = $('h6').map((i, element) => $(element).text()).get();

    return {
        metaRobotsTag,
        canonicalUrl,
        metaTitles,
        metaDescription,
        h1s,
        h2s,
        h3s,
        h4s,
        h5s,
        h6s,
    };
}

export async function POST(req) {
    try {
        const { url } = await req.json();

        // --- Step 1: Try static fetch ---
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
            redirect: 'follow',
        });

        const statusCode = response.status;

        const finalUrl = response.headers.get('location') || response.url;

        if (statusCode >= 300 && statusCode < 400) {
            return new Response(JSON.stringify({ statusCode, finalUrl }), {
                status: statusCode,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    error: `Failed to fetch: ${response.status}`,
                    statusCode,
                    finalUrl,
                }),
                { status: statusCode }
            );
        }

        let html = await response.text();
        let scraped = await scrapeWithCheerio(html);

        // --- Step 2: Check if data is missing ---
        const needsPuppeteer =
            !scraped.metaTitles.length ||
            !scraped.metaDescription ||
            !scraped.h1s.length;

        if (needsPuppeteer) {
            console.log(`⚡ Falling back to Puppeteer for ${url}`);
            const browser = await puppeteer.launch({ headless: 'new' });
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });
            html = await page.content();
            await browser.close();

            scraped = await scrapeWithCheerio(html);
        }

        return new Response(
            JSON.stringify({
                statusCode,
                finalUrl,
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