import { siteUrl, siteName } from "./site";

/*****************************************************
    {
        slug: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        robots: {
            index: true,
            follow: true,
        },
        h1: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        metaDescription: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        scrapeOptions: { all: true },
    },
*****************************************************/

export const tools = [
    {
        slug: "seo-on-page-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "SEO On-Page Checker",
        metaDescription: "Check a webpage for SEO issues including title tags, meta descriptions, headings, links, structured data, and more with our on-page SEO analysis tool.",
        scrapeOptions: { all: true },
    },
        {
        slug: "title-tag-and-meta-description-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Title Tag & Meta Description Length Checker",
        metaDescription: "Check a page’s title tag and meta description and view their character lengths.",
        scrapeOptions: {
            all: false,
            titleTags: true,
            metaDescriptions: true,
        },
    },
        {
        slug: "h1-tag-and-heading-structure-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "H1 Tag & Heading Structure Checker",
        metaDescription: "Check a page's H1 tag and overall heading structure.",
        scrapeOptions: {
            all: false,
            headings: true,
        },
    },
    {
        slug: "image-alt-text-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Image Alt Text Checker",
        metaDescription: "Check a page’s image alt texts, HTTP status codes, and broken links.",
        scrapeOptions: {
            all: false,
            images: true,
        },
    },
    {
        slug: "internal-and-external-link-anchor-text-and-broken-link-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Internal & External Link, Anchor Text & Broken Link Checker",
        metaDescription: "Check a page’s internal, external, and broken links, and view their anchor texts, URLs, HTTP status codes, nofollow attributes, and more.",
        scrapeOptions: {
            all: false,
            links: true,
        },
    },
    {
        slug: "robots-txt-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Robots.txt Checker",
        metaDescription: "Check your website's robots.txt file to see if a page is crawlable and view the XML sitemaps it contains.",
        scrapeOptions: {
            all: false,
            robotsTxt: true,
        },
    },
    {
        slug: "meta-robots-and-x-robots-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Meta Robots & X-Robots-Tag Noindex/Nofollow Checker",
        metaDescription: "Check a page’s meta robots tag to see whether it can be indexed and whether its links pass authority.",
        scrapeOptions: {
            all: false,
            metaRobotsAndXRobotsTag: true,
        },
    },
    {
        slug: "canonical-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Canonical Tag Checker",
        metaDescription: "Check a page’s canonical tag to see which URL search engines should index.",
        scrapeOptions: {
            all: false,
            canonicalTags: true,
        },
    },
    {
        slug: "xml-sitemap-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "XML Sitemap Checker",
        metaDescription: "Check your XML sitemaps, see which ones contain a specific URL, and view all sitemap entries listed in your robots.txt file.",
        scrapeOptions: {
            all: false,
            xmlSitemaps: true,
        },
    },
    {
        slug: "structured-data-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Structured Data Checker",
        metaDescription: "Check a page’s structured data and detect errors to see if it’s eligible for indexing and rich snippets.",
        scrapeOptions: {
            all: false,
            structuredData: true,
        },
    },
    {
        slug: "open-graph-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Open Graph Checker",
        metaDescription: "Check a page for Open Graph tags and see its titles, descriptions, images, locale, and more.",
        scrapeOptions: {
            all: false,
            openGraph: true,
        },
    },
    {
        slug: "hreflang-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Hreflang Checker",
        metaDescription: "View a page’s hreflang tags and see the linked URLs and target languages.",
        scrapeOptions: {
            all: false,
            hreflang: true,
        },
    },
    {
        slug: "viewport-meta-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Viewport Meta Tag Checker",
        metaDescription: "Check a page’s viewport meta tag to see how it controls mobile responsiveness and scaling.",
        scrapeOptions: {
            all: false,
            viewport: true,
        },
    },
    {
        slug: "pagination-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Pagination Checker",
        metaDescription: "Check pagination links on a page and see their URLs and canonical information.",
        scrapeOptions: {
            all: false,
            pagination: true,
        },
    },
].map((tool) => {
    return (
        {
            ...tool,
            canonicalUrl: `${siteUrl}tools/${tool.slug}`,
            titleTag: `${tool.h1} | ${siteName}`,
        }
    )
})
