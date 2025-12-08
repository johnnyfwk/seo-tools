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

const scrapeOptions = { all: true };

export const metadata = utils.createMetadata(
    siteUrl,
    siteName,
    page,
    openGraphLocale,
    openGraphType,
    openGraphImage,
);

export default function SeoOnPageChecker() {
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