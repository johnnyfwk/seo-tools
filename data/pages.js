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
        slug: "/viewport-meta-tag-checker",
        h1: "Free Viewport Meta Tag Checker",
        metaDescription: "Check a page’s viewport meta tag to see how it controls mobile responsiveness and scaling.",
    },
    {
        slug: "/title-tag-and-meta-description-checker",
        h1: "Free Title Tag & Meta Description Length Checker",
        metaDescription: "Check if a page has a title tag and meta description, and view their lengths.",
    },
    {
        slug: "/h1-tag-and-headings-checker",
        h1: "Free H1 Tag & Heading Structure Checker",
        metaDescription: "Check a page's H1 tag and overall heading structure.",
    },
    {
        slug: "/internal-external-and-broken-link-checker",
        h1: "Free Internal, External & Broken Link Checker",
        metaDescription: "Check a page’s internal, external, and broken links, and view their anchor texts, URLs, status codes, nofollow attributes, and more.",
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
