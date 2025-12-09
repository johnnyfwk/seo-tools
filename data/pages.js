import { siteUrl, siteName } from "./site";

/*****************************************************************
    {
        slug: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        robots: {
            index: true,
            follow: true,
        },
        h1: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        metaDescription: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
*****************************************************************/

export const pages = [
    {
        slug: "tools",
        robots: {
            index: true,
            follow: true,
        },
        h1: "SEO Tools",
        metaDescription: "Use our SEO tools to identify and fix website issues.",
        priority: 7,
    },
    {
        slug: "about",
        robots: {
            index: true,
            follow: true,
        },
        h1: "About",
        metaDescription: "Learn who we are and how our SEO tools help improve your website.",
        priority: 5,
    },
    {
        slug: "contact",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Contact Us",
        metaDescription: "Have questions or feedback? Contact us and let us know how we can improve our SEO tools.",
        priority: 5,
    },
    {
        slug: "privacy-policy",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Privacy Policy",
        metaDescription: "Read our Privacy Policy to learn how we collect, use, and protect your data when you use our SEO tools.",
        priority: 1,
    },
    {
        slug: "terms-of-service",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Terms of Service",
        metaDescription: "Read our Terms of Service to understand the rules for using our SEO tools, website, and features.",
        priority: 1,
    },
    {
        slug: "disclaimer",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Disclaimer",
        metaDescription: "Read our Disclaimer to understand the limitations of our SEO tools and the accuracy of the data provided.",
        priority: 1,
    },
    {
        slug: "cookie-policy",
        robots: {
            index: true,
            follow: true,
        },
        h1: "Cookie Policy",
        metaDescription: "Learn how we use cookies and tracking technologies to improve your experience on our website.",
        priority: 1,
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
