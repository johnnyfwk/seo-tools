export const siteUrl = "https://seotools.com/";
export const siteName = "SEOTools";
export const defaultTitle = "Free SEO Tools to Analyse & Optimise Your Site";
export const defaultMetaDescription = "Use our free SEO tools to analyse your site, find issues, and improve organic search performance.";
export const openGraphLocale = "en_GB";
export const openGraphType = "website";
export const openGraphImage = "images/logo.jpg";

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
        slug: "seo-on-page-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free SEO On-Page Checker",
        metaDescription: "Check a webpage for SEO issues including title tags, meta descriptions, headings, links, structured data, and more with our on-page SEO analysis tool.",
    },
    {
        slug: "robots-txt-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Robots.txt Checker",
        metaDescription: "Check your website's robots.txt file to see if a page is crawlable and view the XML sitemaps it contains.",
    },
    {
        slug: "meta-robots-and-x-robots-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Meta Robots & X-Robots-Tag Noindex/Nofollow Checker",
        metaDescription: "Check a page’s meta robots tag to see whether it can be indexed and whether its links pass authority.",
    },
    {
        slug: "canonical-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Canonical Tag Checker",
        metaDescription: "Check a page’s canonical tag to see which URL search engines should index.",
    },
    {
        slug: "xml-sitemap-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free XML Sitemap Checker",
        metaDescription: "Check your XML sitemaps, see which ones contain a specific URL, and view all sitemap entries listed in your robots.txt file.",
    },
    {
        slug: "viewport-meta-tag-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Viewport Meta Tag Checker",
        metaDescription: "Check a page’s viewport meta tag to see how it controls mobile responsiveness and scaling.",
    },
    {
        slug: "title-tag-and-meta-description-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Title Tag & Meta Description Length Checker",
        metaDescription: "Check a page’s title tag and meta description and view their character lengths.",
    },
    {
        slug: "h1-tag-and-heading-structure-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free H1 Tag & Heading Structure Checker",
        metaDescription: "Check a page's H1 tag and overall heading structure.",
    },
    {
        slug: "image-alt-text-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Image Alt Text Checker",
        metaDescription: "Check a page’s image alt texts, HTTP status codes, and broken links.",
    },
    {
        slug: "structured-data-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Structured Data Checker",
        metaDescription: "Check a page’s structured data and detect errors to see if it’s eligible for indexing and rich snippets.",
    },
    {
        slug: "open-graph-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Open Graph Checker",
        metaDescription: "Check a page for Open Graph tags and see its titles, descriptions, images, locale, and more.",
    },
    {
        slug: "hreflang-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Hreflang Checker",
        metaDescription: "View a page’s hreflang tags and see the linked URLs and target languages.",
    },
    {
        slug: "pagination-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Pagination Checker",
        metaDescription: "Check pagination links on a page and see their URLs and canonical information.",
    },
    {
        slug: "internal-and-external-link-anchor-text-and-broken-link-checker",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Free Internal & External Link, Anchor Text & Broken Link Checker",
        metaDescription: "Check a page’s internal, external, and broken links, and view their anchor texts, URLs, HTTP status codes, nofollow attributes, and more.",
    },
    {
        slug: "internal-and-backlink-checker",
        robots: {
            index: false,
            follow: true,
        },
        h1: "Free Internal & Backlink Checker",
        metaDescription: "Check if a link exists from any page, internal or external, to a page on your site using our backlink and link checker tool.",
    },
    {
        slug: "about",
        robots: {
            index: true,
            follow: true,
        },
        h1: "About",
        metaDescription: "Learn who we are and how our SEO tools help improve your website.",
    },
    {
        slug: "contact",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Contact Us",
        metaDescription: "Have questions or feedback? Contact us and let us know how we can improve our SEO tools.",
    },
    {
        slug: "privacy-policy",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Privacy Policy",
        metaDescription: "Read our Privacy Policy to learn how we collect, use, and protect your data when you use our SEO tools.",
    },
    {
        slug: "terms-of-service",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Terms of Service",
        metaDescription: "Read our Terms of Service to understand the rules for using our SEO tools, website, and features.",
    },
    {
        slug: "disclaimer",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Disclaimer",
        metaDescription: "Read our Disclaimer to understand the limitations of our SEO tools and the accuracy of the data provided.",
    },
    {
        slug: "cookie-policy",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Cookie Policy",
        metaDescription: "Learn how we use cookies and tracking technologies to improve your experience on our website.",
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
