const siteUrl = "https://seotools.uk";
const siteName = "SEO Tools";

/*****************************************************
    {
        slug: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        robots: {
            index: true,
            follow: true,
        },
        h1: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        metaDescription: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
*****************************************************/

export const pages = [
    {
        slug: "/seo-on-page-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free SEO On-Page Checker",
        metaDescription: "This is the meta description for the free SEO on-page checker page.",
    },
    {
        slug: "/robots-txt-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Robots.txt Checker",
        metaDescription: "Check your website's robots.txt file to see if a page is crawlable and view the XML sitemaps it contains.",
    },
    {
        slug: "/meta-robots-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Meta Robots Tag, Noindex & Nofollow Checker",
        metaDescription: "Check a page’s meta robots tag to see whether it can be indexed and whether its links pass authority.",
    },
    {
        slug: "/canonical-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Canonical Tag Checker",
        metaDescription: "Check a page’s canonical tag to see which URL search engines should index.",
    },
    {
        slug: "/viewport-meta-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Viewport Meta Tag Checker",
        metaDescription: "Check a page’s viewport meta tag to see how it controls mobile responsiveness and scaling.",
    },
    {
        slug: "/title-tag-and-meta-description-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Title Tag & Meta Description Length Checker",
        metaDescription: "Check if a page has a title tag and meta description, and view their lengths.",
    },
    {
        slug: "/h1-tag-and-heading-structure-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free H1 Tag & Heading Structure Checker",
        metaDescription: "Check a page's H1 tag and overall heading structure.",
    },
    {
        slug: "/image-alt-text-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Image Alt Text Checker",
        metaDescription: "Check a page’s image alt texts, HTTP status codes, and broken links.",
    },
    {
        slug: "/structured-data-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Structured Data Checker",
        metaDescription: "Check a page for structured data to detect and fix errors, validate schema, and boost indexing and rich snippet performance.",
    },
    {
        slug: "/open-graph-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Open Graph Checker",
        metaDescription: "Check a page for Open Graph metadata, including title, description, images, videos, and site info while validating URLs and auditing SEO signals.",
    },
    {
        slug: "/hreflang-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Hreflang Checker",
        metaDescription: "Check a page’s hreflang links, validate URLs, track redirects, and audit SEO signals like robots.txt, meta robots, and canonical tags.",
    },
    {
        slug: "/pagination-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Pagination Checker",
        metaDescription: "Check pagination links, resolve redirects, and validate canonical tags to ensure clean, crawlable, and indexable pagination.",
    },
    {
        slug: "/internal-external-and-broken-link-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Internal & External Link, Anchor Text & Broken Link Checker",
        metaDescription: "Check a page’s internal, external, and broken links, and view their anchor texts, URLs, HTTP status codes, nofollow attributes, and more.",
    },
    {
        slug: "/internal-and-backlink-checker",
        robots: {
            index: false,
            follow: true,
        },
        h1: "Free Internal & Backlink Checker",
        metaDescription: "Check the anchor texts and status codes of a page's internal and external links.",
    },
].map((page) => {
    return (
        {
            ...page,
            canonicalUrl: `${siteUrl}${page.slug}`,
            titleTag: `${page.h1} | ${siteName}`,
        }
    )
})
