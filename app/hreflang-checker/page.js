import ClientSeoOnPageChecker from "../clientPages/clientSeoOnPageChecker";
import { siteUrl, siteName, pages } from "@/data/pages";
import * as utils from '@/app/lib/utils/utils';

const slug = utils.getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

if (!page) throw new Error(`Page not found: ${slug}`);

const scrapeOptions = {
    all: false,
    hreflang: true,
}

export default function HreflangChecker() {
    const metadata = utils.generateMetadataForToolPages(siteUrl, siteName, page);

    return (
        <>
            <ClientSeoOnPageChecker
                h1={page.h1}
                metaDescription={page.metaDescription}
                scrapeOptions={scrapeOptions}
            />
            
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: metadata.structuredData["application/ld+json"] }}
            />
        </>
    )
}