import { siteUrl } from "@/data/pages";

export default function sitemap() {
    return [
        {
            url: siteUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${siteUrl}seo-on-page-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}internal-external-and-broken-link-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // {
        //     url: `${siteUrl}internal-and-backlink-checker`,
        //     lastModified: new Date().toISOString(),
        //     changeFrequency: 'monthly',
        //     priority: 0.9,
        // },
        {
            url: `${siteUrl}robots-txt-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}meta-robots-tag-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}canonical-tag-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}viewport-meta-tag-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}title-tag-and-meta-description-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}h1-tag-and-heading-structure-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}image-alt-text-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}structured-data-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}open-graph-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}hreflang-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}pagination-checker`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}about`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${siteUrl}contact`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];
}
