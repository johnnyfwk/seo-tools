import ClientSeoOnPageChecker from "../clientPages/clientSeoOnPageChecker";
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

if (!page) throw new Error(`Page not found: ${slug}`);

const scrapeOptions = {
    all: false,
    openGraph: true,
}

export const metadata = {
    title: page.titleTag,
    description: page.metaDescription,
    robots: {
        index: page.robots.index,
        follow: page.robots.follow,
    },
    alternates: {
        canonical: page.canonicalUrl,
    },
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
};

export default function OpenGraphChecker() {
    const structuredData = utils.generateMetadataForToolPages(siteUrl, siteName, page)
        .structuredData["application/ld+json"];

    return (
        <>
            <ClientSeoOnPageChecker
                h1={page.h1}
                metaDescription={page.metaDescription}
                scrapeOptions={scrapeOptions}
            />
            
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: structuredData }}
            />
        </>
    )
}