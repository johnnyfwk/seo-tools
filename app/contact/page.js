import { siteUrl, siteName, pages } from "@/data/pages";
import * as utils from '@/app/lib/utils/utils';

const slug = utils.getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

if (!page) throw new Error(`Page not found: ${slug}`);

export const metadata = {
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: page.canonicalUrl,
    },
    title: page.titleTag,
    description: page.metaDescription,
}

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
                }
            },
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": siteName,
                "url": siteUrl
                // "logo": `${siteUrl}/logo.png`
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
                "mainEntity": {
                    "@id": `${siteUrl}#organization`
                }
            }
        ]
    };

    return (
        <section>
            <h1>{page.h1}</h1>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tristique urna tellus, sed dignissim enim aliquet eu. Nullam aliquet vitae enim vestibulum consequat. Aenean nisi nisl, vestibulum vitae pretium non, faucibus et nibh. Curabitur sed dolor non risus fringilla dictum sit amet id sem. Vestibulum vitae est eget magna semper dictum. Cras luctus mi et nulla rutrum egestas. Duis hendrerit ligula id est semper, fringilla varius lacus interdum. Cras dignissim risus sed nisi consequat varius.</p>

            <p>Morbi risus nibh, cursus sed auctor eget, faucibus in neque. Sed mattis auctor enim. Ut ut magna hendrerit, blandit enim non, maximus dolor. Ut sapien est, porta nec cursus vitae, accumsan eu tellus. Sed a rhoncus nunc. Etiam elementum in massa vitae congue. Etiam ut auctor eros, non dictum urna. Fusce eu enim at sapien varius pulvinar. Ut id porttitor leo. Vestibulum sem urna, volutpat ut augue eget, congue tempus sapien. Duis placerat hendrerit felis. Mauris sodales vestibulum erat, in tempus magna.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
            />
        </section>
    )
}