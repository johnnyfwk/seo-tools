import ClientSeoOnPageChecker from "@/app/clientPages/clientSeoOnPageChecker";
import * as utils from '@/app/lib/utils/utils';
import { tools } from "@/data/tools";
import {
    siteUrl,
    siteName,
    openGraphLocale,
    openGraphType,
    openGraphImage,
} from "@/data/site";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const tool = tools.find((t) => t.slug === slug);
    if (!tool) {
        return {
            title: "Tool Not Found",
            description: "This tool does not exist."
        }
    }

    return {
        robots: {
            index: tool.robots.index,
            follow: tool.robots.follow,
        },
        alternates: {
            canonical: tool.canonicalUrl,
        },
        title: `Free ${tool.titleTag}`,
        description: tool.metaDescription,
        openGraph: {
            title: `Free ${tool.titleTag}`,
            description: tool.metaDescription,
            url: tool.canonicalUrl,
            siteName,
            locale: openGraphLocale,
            type: openGraphType,
            images: [
                {
                    url: `${siteUrl}${openGraphImage}`
                }
            ],
        }
    }
}

export default async function Tool({ params }) {
    const { slug } = await params;

    const tool = tools.find((t) => t.slug === slug);
    if (!tool) {
        throw new Error(`Page not found: /tools/${slug}`)
    };

    const structuredDataArray = utils.generateStructuredDataForToolPages(siteUrl, siteName, tool);

    return (
        <>
            <ClientSeoOnPageChecker
                h1={tool.h1}
                metaDescription={tool.metaDescription}
                scrapeOptions={tool.scrapeOptions}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataArray) }}
            />
        </>
    )
}