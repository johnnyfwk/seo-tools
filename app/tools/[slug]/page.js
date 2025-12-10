import ClientSeoOnPageChecker from '@/app/clientPages/clientSeoOnPageChecker';
import ToolCard from '@/app/components/toolCard';
import Link from 'next/link';
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

    const otherTools = tools.filter((tool) => tool.slug !== slug);

    const structuredDataArray = utils.generateStructuredDataForToolPages(siteUrl, siteName, tool);

    return (
        <>
            <ClientSeoOnPageChecker
                h1={tool.h1}
                metaDescription={tool.metaDescription}
                scrapeOptions={tool.scrapeOptions}
            />

            <section>
                <h2>Other SEO Tools</h2>

                {otherTools.length > 0
                ? <div className="tool-card-container">
                    {otherTools.map((otherTool, i) => {
                        return (
                            <ToolCard key={i} tool={otherTool}>
                                <h2>
                                    <Link href={`/tools/${otherTool.slug}`}>{otherTool.h1}</Link>
                                </h2>
                            </ToolCard>
                        )
                    })}
                </div>
                : <p>No other tools available.</p>
            }
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataArray) }}
            />
        </>
    )
}