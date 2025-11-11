import { fetchRedirectInfo } from "../utils/fetchRedirectInfo";
import { scrapeCanonicalTag } from "./canonicalTag";
import { scrapeMetaRobotsTag } from "./metaRobotsTag";
import { checkRobotsTxt } from "./robotsTxt";
import * as cheerio from 'cheerio';

export async function scrapeOpenGraph($, pageUrl) {
    const openGraph = {
        title: '',
        type: '',
        url: '',
        ogUrlStatusCode: null,
        ogUrlFinalUrl: '',
        ogUrlIsSelfCanonical: null,
        ogUrlNoindex: null,
        ogUrlRobotsAllowed: null,
        image: null,
        description: '',
        siteName: '', // canonical property
        audio: '',
        video: '',
        locale: '',
        determiner: '',
    };

    $('meta[property^="og:"]').each((_, element) => {
        const property = $(element).attr('property');
        const content = $(element).attr('content');
        if (property && content) {
            let key = property.replace(/^og:/, '');
            // Normalize site_name → siteName
            if (key === 'site_name') key = 'siteName';
            openGraph[key] = content;
        }
    });

    let ogUrl = openGraph.url;

    if (ogUrl) {
        try {
            ogUrl = new URL(ogUrl, pageUrl).href;
        } catch {
            console.warn(`Invalid OG URL: ${ogUrl}`);
        }
    }

    if (!ogUrl) return { openGraph };

    // ------------------------------
    // Step 1: Scrape OG URL page
    // ------------------------------
    let $ogPage = null;
    try {
        const res = await fetch(ogUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Crawler/1.0)' }
        });
        if (res.ok) {
            const html = await res.text();
            $ogPage = cheerio.load(html);
        } else {
            console.warn(`OG URL fetch returned status ${res.status}: ${ogUrl}`);
        }
    } catch (err) {
        console.warn(`Failed to fetch OG URL HTML for ${ogUrl}:`, err.message);
    }

    // Scrape canonical & meta robots if HTML is available
    let canonicalUrl = ogUrl;
    let allowsIndexing = true;

    if ($ogPage) {
        const canonicalData = scrapeCanonicalTag($ogPage, ogUrl);
        canonicalUrl = canonicalData.canonicalUrl || ogUrl;

        const metaRobotsData = scrapeMetaRobotsTag($ogPage);
        if (metaRobotsData && metaRobotsData.metaRobotsTag) {
            allowsIndexing = metaRobotsData.metaRobotsTag.allowsIndexing;
        }
    }

    openGraph.ogUrlIsSelfCanonical = canonicalUrl === ogUrl;
    openGraph.ogUrlNoindex = !allowsIndexing;

    // Check robots.txt
    try {
        const robotsCheck = await checkRobotsTxt(ogUrl, '*');
        openGraph.ogUrlRobotsAllowed = robotsCheck.allowed;
    } catch {
        openGraph.ogUrlRobotsAllowed = null;
    }

    // ------------------------------
    // Step 2: Follow redirects to final URL
    // ------------------------------
    try {
        const redirectInfo = await fetchRedirectInfo(ogUrl);
        openGraph.ogUrlFinalUrl = redirectInfo.finalUrl;
        openGraph.ogUrlStatusCode = redirectInfo.finalUrlStatusCode;
    } catch (err) {
        console.warn(`Failed to fetch OG URL redirects for ${ogUrl}:`, err.message);
    }

    // Human-readable missing fields
    const readableMap = {
        title: 'Title',
        type: 'Type',
        url: 'URL',
        ogUrlStatusCode: 'OG URL Status Code',
        ogUrlFinalUrl: 'OG URL Final URL',
        ogUrlIsSelfCanonical: 'OG URL Self-Canonical',
        ogUrlNoindex: 'OG URL Noindex',
        ogUrlRobotsAllowed: 'OG URL Robots Allowed',
        image: 'Image',
        description: 'Description',
        siteName: 'Site Name',
        audio: 'Audio',
        video: 'Video',
        locale: 'Locale',
        determiner: 'Determiner',
    };

    openGraph.missingTags = Object.entries(openGraph)
        .filter(([_, value]) => value === '' || value === null)
        .map(([key]) => readableMap[key] || key);

    return { openGraph };
}
