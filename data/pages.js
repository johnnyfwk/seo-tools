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
        slug: "/robots-txt-checker",
        h1: "Free Robots.txt Checker",
        metaDescription: "Check your website's robots.txt file to see if a page is crawlable and view the XML sitemaps it contains.",
    },
    {
        slug: "/meta-robots-tag-checker",
        h1: "Free Meta Robots Tag, Noindex & Nofollow Checker",
        metaDescription: "Check a page’s meta robots tag to see whether it can be indexed and whether its links pass authority.",
    },
    {
        slug: "/canonical-tag-checker",
        h1: "Free Canonical Tag Checker",
        metaDescription: "Check a page’s canonical tag to see which URL search engines should index.",
    },
    {
        slug: "/title-tag-and-meta-description-checker",
        h1: "Free Title Tag & Meta Description Length Checker",
        metaDescription: "Check if a page has a title tag and meta description, and view their lengths.",
    },
    {
        slug: "/h1-and-headings-checker",
        h1: "Free H1 & Headings Checker",
        metaDescription: "Check a page's H1 tag and heading hierarchy structure.",
    },
    {
        slug: "/link-checker",
        h1: "Free Internal & External Link Checker",
        metaDescription: "Check the anchor texts and status codes of a page's internal and external links.",
    },
].map((page) => {
    return (
        {
            ...page,
            titleTag: `${page.h1} | ${siteName}`
        }
    )
})
