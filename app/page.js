import Link from "next/link";
import ToolCard from "./components/toolCard";
import { tools } from "@/data/tools";
import {
    siteUrl,
    siteName,
    defaultTitle,
    defaultMetaDescription,
    openGraphLocale,
    openGraphType,
    openGraphImage,
} from "@/data/site";

export const metadata = {
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: siteUrl,
    },
    title: `${defaultTitle} | ${siteName}`,
    description: defaultMetaDescription,
    openGraph: {
        title: defaultTitle,
        description: defaultMetaDescription,
        url: siteUrl,
        siteName,
        locale: openGraphLocale,
        type: openGraphType,
        images: [
            {
                url: `${siteUrl}${openGraphImage}`
            }
        ],
    },
}

export default function Home() {
    const homePageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "url": siteUrl,
                "name": siteName,
                "publisher": {
                    "@id": `${siteUrl}#organization`
                },
            },
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": siteName,
                "url": siteUrl,
                "logo": `${siteUrl}${openGraphImage}`
            }
        ],
    };

    return (
        <>
            <section>
                <h1>{defaultTitle}</h1>

                <p>{defaultMetaDescription}</p>

                {tools.length > 0
                    ? <div className="tool-card-container">
                        {tools.map((tool, i) => {
                            return (
                                <ToolCard key={i} tool={tool}>
                                    <h2>
                                        <Link href={`/tools/${tool.slug}`}>{tool.h1}</Link>
                                    </h2>
                                </ToolCard>
                            )
                        })}
                    </div>
                    : <p>No tools available.</p>
                }
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
            />
        </>
    );
}