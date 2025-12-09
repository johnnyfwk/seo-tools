import { siteUrl } from "@/data/site";
import { tools } from "@/data/tools";
import { pages } from "@/data/pages";

const toolsArray = tools.map((tool, i) => {
    return (
        {
            url: `${siteUrl}tools/${tool.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.9,
        }
    )
})

const pagesArray = pages.map((page, i) => {
    return (
        {
            url: `${siteUrl}${page.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'yearly',
            priority: page.priority,
        }
    )
})

export default function sitemap() {
    return [
        {
            url: siteUrl,
            lastModified: new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        ...toolsArray,
        ...pagesArray,
    ];
}
