import {
    siteUrl,
    siteName,
    pages,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/pages";
import * as utils from '@/app/lib/utils/utils';

const slug = utils.getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

export const metadata = {
    robots: {
        index: page.robots.index,
        follow: page.robots.follow,
    },
    alternates: {
        canonical: page.canonicalUrl,
    },
    title: page.titleTag,
    description: page.metaDescription,
    openGraph: {
        title: page.titleTag,
        description: page.metaDescription,
        url: page.canonicalUrl,
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

export default function Disclaimer() {
    const disclaimerPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page.titleTag,
        "url": page.canonicalUrl,
        "publisher": {
            "@id": `${siteUrl}#organization`,
            "name": siteName,
            "logo": `${siteUrl}${openGraphImage}`
        }
    };

    return (
        <section>
            <h1>{page.h1}</h1>

            <p>The SEO tools and information provided on {siteName} are for general informational purposes only. While we strive for accuracy, we make no warranties regarding the completeness, reliability, or effectiveness of the tools.</p>

            <p>You agree that <strong>we are not responsible for any decisions or actions you take</strong> based on the information provided. Results may vary depending on multiple factors outside our control.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(disclaimerPageSchema) }}
            />
        </section>
    )
}