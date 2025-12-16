import * as utils from '@/app/lib/utils/utils';
import { pages } from '@/data/pages';
import {
    siteUrl,
    siteName,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/site";

const slug = "contact";

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

export default function Contact() {
    const contactPageSchema = {
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
                "@type": "ContactPage",
                "@id": `${siteUrl}contact#contactpage`,
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

            <p>Have a question, suggestion, or feedback? We'd love to hear from you!</p>

            <p>Get in touch with us at hi@example.com, and we’ll get back to you as soon as we can. Your input is incredibly valuable and helps us make our tools even better.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
            />
        </section>
    )
}