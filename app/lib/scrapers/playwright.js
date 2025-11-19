import { chromium } from "playwright";
import { scrapeWithCheerio } from "./index"; // reuse your existing scrapers

export async function scrapeWithPlaywright(url, opts = {}) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Optional: set headers to mimic a real browser
    await page.setExtraHTTPHeaders({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    });

    await page.goto(url, { waitUntil: "networkidle" });

    // Get the fully rendered HTML
    const html = await page.content();
    await browser.close();

    // Reuse your existing Cheerio scrapers
    const scrapedData = await scrapeWithCheerio(html, url, {}, opts);
    return scrapedData;
}
