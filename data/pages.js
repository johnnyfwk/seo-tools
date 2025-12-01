const siteName = "SEO Tools";

/*****************************************************
    {
        slug: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        h1: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
        metaDescription: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
*****************************************************/

export const pages = [
    {
        slug: "/seo-on-page-checker",
        h1: "Free SEO On-Page Checker",
        metaDescription: "This is the meta description for the free SEO on-page checker page.",
    },
    {
        slug: "/title-tag-and-meta-description-checker",
        h1: "Free Title Tag & Meta Description Length Checker",
        metaDescription: "Check if a page has a title tag and meta description, and view their lengths.",
    },
    {
        slug: "/robots-txt-checker",
        h1: "Free Robots.txt Checker",
        metaDescription: "Check a website's robots.txt to see if a page is crawlable and view the XML sitemaps it contains.",
    },
    {
        slug: "/link-checker",
        h1: "Free Internal & External Link Checker",
        metaDescription: "Check the anchor texts and status codes of a page's internal and external links.",
    },
].map(page => ({
    ...page,
    titleTag: `${page.h1} | ${siteName}`,
}));