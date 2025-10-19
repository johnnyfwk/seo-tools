import * as cheerio from "cheerio";

export async function POST(request) {
    try {
        const { xmlSitemap } = await request.json();
        
        if (!xmlSitemap) {
            return Response.json({ error: "Missing sitemap URL" }, { status: 400 });
        }

        if (!/^https?:\/\//i.test(xmlSitemap)) {
            return Response.json({ error: "Please enter a valid URL starting with http:// or https://" }, { status: 400 });
        }

        // Fetch the XML sitemap
        const response = await fetch(xmlSitemap);
        if (!response.ok) {
            return Response.json({ error: "Failed to fetch sitemap." }, { status: 500 });
        }

        async function fetchSitemap(url, visited = new Set()) {
            if (visited.has(url)) return []; // prevent infinite loops

            visited.add(url);

            const res = await fetch(url);

            if (!res.ok) return [];

            const xml = await res.text();
            const $ = cheerio.load(xml, { xmlMode: true });

            // Check for sitemap index
            const sitemapUrls = $("sitemap > loc")
                .map((i, el) => $(el).text().trim())
                .get();

            if (sitemapUrls.length > 0) {
                // It's a sitemap index → fetch each child sitemap
                const urlsArrays = await Promise.all(
                    sitemapUrls.map((childUrl) => fetchSitemap(childUrl, visited))
                );
                return urlsArrays.flat();
            } else {
                // It's a regular sitemap → extract page URLs
                return $("url > loc")
                    .map((i, el) => $(el).text().trim())
                    .get();
            }
        }

        const urls = await fetchSitemap(xmlSitemap);

        // Remove duplicates and empty strings
        const uniqueUrls = [...new Set(urls)].filter(Boolean);

        return Response.json({ urls: uniqueUrls });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Error parsing sitemap" }, { status: 500 });
    }
}