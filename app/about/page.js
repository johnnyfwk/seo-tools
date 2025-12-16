import * as utils from '@/app/lib/utils/utils';
import { pages } from '@/data/pages';
import {
    siteUrl,
    siteName,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/site";

const slug = "about";

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

export default function About() {
    const aboutPageSchema = {
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
                "inLanguage": "en-GB"
            },
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": siteName,
                "url": siteUrl,
                "logo": `${siteUrl}${openGraphImage}`,
                "inLanguage": "en-GB"
            },
            {
                "@type": "AboutPage",
                "@id": `${siteUrl}about#aboutpage`,
                "url": page.canonicalUrl,
                "name": page.h1,
                "description": page.metaDescription,
                "isPartOf": {
                    "@id": `${siteUrl}#website`
                },
                "inLanguage": "en-GB"
            }
        ]
    };

    return (
        <section>
            <h1>{page.h1}</h1>

            <p>{siteName} offers a suite of free SEO tools to help website owners, marketers, and SEO professionals better understand their sites. Our tools provide clear insights into the elements that matter most, like title tags, meta descriptions, headings, structured data, links, images, and more, so you can spot issues, optimise your content, and improve your site’s organic performance in search engines.</p>

            <p>We built {siteName} to save you time and make SEO approachable. Whether you’re fixing small issues, tracking your progress, or exploring ways to improve, our tools help you get the information you need quickly and easily.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
            />
        </section>
    )
}