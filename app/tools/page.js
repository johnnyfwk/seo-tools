import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';
import { tools } from "@/data/tools";
import { pages } from "@/data/pages";
import {
    siteUrl,
    siteName,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/site";

const slug = "tools";

const page = pages.find((p) => p.slug === slug);

if (!page) throw new Error(`Page not found: ${slug}`);

export const metadata = utils.createMetadata(
    siteUrl,
    siteName,
    page,
    openGraphLocale,
    openGraphType,
    openGraphImage,
);

export default function Tools() {
    const toolsPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page.h1,
        "description": page.metaDescription,
        "url": page.canonicalUrl,
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": tools.map((tool, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${siteUrl}tools/${tool.slug}`,
            "name": tool.h1,
        })),
    };

    return (
        <>
            <section>
                <h1>{page.h1}</h1>
                <p>{page.metaDescription}</p>

                {tools.length > 0
                    ? <ul>
                        {tools.map((tool, i) => {
                            return (
                                <li key={i}>
                                    <Link
                                        href={`/tools/${tool.slug}`}
                                        className="tools-page-link"
                                    >{tool.h1}</Link>
                                </li>
                            )
                        })}
                    </ul>
                    : <p>No tools available.</p>
                }
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsPageSchema) }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />
        </>        
    )
}