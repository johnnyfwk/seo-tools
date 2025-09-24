import * as cheerio from 'cheerio';

export async function POST(req) {
    try {
        const { url } = await req.json();

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0)', // Mimic a browser request
            }
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: `Failed to fetch: ${response.status}` }),
                { status: response.status }
            );
        }

        const html = await response.text(); // Get the HTML content of the page
        const $ = cheerio.load(html); // Load HTML into Cheerio for parsing

        const metaTitle = $('title').text().trim();  // Extract the content of the <title> tag

        return new Response(
            JSON.stringify({ metaTitle }),
            {
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