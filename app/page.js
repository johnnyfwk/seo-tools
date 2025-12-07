import Link from "next/link";
import { siteUrl, siteName } from "@/data/pages";

const description = "Use our free SEO tools to analyse your site, find issues, and improve organic search performance.";

export const metadata = {
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: siteUrl,
    },
    title: `Free SEO Tools to Analyse & Optimise Your Site | ${siteName}`,
    description,
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
            <h1>Home</h1>

            <p>{description}</p>

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