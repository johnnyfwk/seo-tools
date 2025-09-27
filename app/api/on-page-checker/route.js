import * as cheerio from 'cheerio';

export async function POST(req) {
    try {
        const { url } = await req.json();

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0)', // Mimic a browser request
            },
            redirect: "manual" // prevents auto-follow
        });

        const statusCode = response.status;

        const finalUrl = response.headers.get("location") || response.url;

        // If it's a redirect (3xx), just return status + final URL
        if (statusCode >= 300 && statusCode < 400) {
            return new Response(
                JSON.stringify({ statusCode, finalUrl }),
                {
                    status: statusCode,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        if (!response.ok) {
            return new Response(
                JSON.stringify({
                    error: `Failed to fetch: ${response.status}`,
                    statusCode,
                    finalUrl
                }),
                { status: statusCode }
            );
        }

        // Otherwise, fetch the final page content
        const html = await response.text(); // Get the HTML content of the page
        const $ = cheerio.load(html); // Load HTML into Cheerio for parsing

        const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';

        const metaTitles = $('title')
            .map((i, element) => $(element).text())
            .get();

        const metaDescription = $('meta[name="description"]').attr('content') || '';

        const h1s = $('h1').map((i, element) => $(element).text()).get();
        const h2s = $('h2').map((i, element) => $(element).text()).get();
        const h3s = $('h3').map((i, element) => $(element).text()).get();
        const h4s = $('h4').map((i, element) => $(element).text()).get();
        const h5s = $('h5').map((i, element) => $(element).text()).get();
        const h6s = $('h6').map((i, element) => $(element).text()).get();
        
        return new Response(
            JSON.stringify({
                statusCode,
                finalUrl,
                canonicalUrl,
                metaTitles,
                metaDescription,
                h1s,
                h2s,
                h3s,
                h4s,
                h5s,
                h6s,
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500 }
        );
    }
}