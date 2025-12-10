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
                // url: `${siteUrl}${openGraphImage}`
                url: "https://cdn.pixabay.com/photo/2015/08/09/14/26/frog-881654_1280.jpg"
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
            <h1>{defaultTitle}</h1>

            <p>{defaultMetaDescription}</p>

            {tools.length > 0
                ? <div className="tool-card-container">
                    {tools.map((tool, i) => {
                        return (
                            <ToolCard key={i} tool={tool}>
                                <h2>
                                    <Link href={tool.slug}>{tool.h1}</Link>
                                </h2>
                            </ToolCard>
                        )
                    })}
                </div>
                : <p>No tools available.</p>
            }

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
            />
        </>
    );
}