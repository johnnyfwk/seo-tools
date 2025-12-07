import Link from "next/link";
import { siteUrl, siteName, defaultTitle, defaultMetaDescription } from "@/data/pages";

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
                // "logo": `${siteUrl}/logo.png`,
            }
        ],
    };

    return (
        <>
            <h1>{defaultTitle}</h1>

            <p>{defaultMetaDescription}</p>

            <h2>
                <Link href="/seo-on-page-checker">SEO On-Page Checker</Link>
            </h2>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
            />
        </>
    );
}