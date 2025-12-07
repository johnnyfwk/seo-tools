import ClientSeoOnPageChecker from "../clientPages/clientSeoOnPageChecker";
import { getSlugFromFile } from "../lib/utils/utils";
import { siteUrl, siteName, pages } from "@/data/pages";
import * as utils from '@/app/lib/utils/utils';

const slug = getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

if (!page) throw new Error(`Page not found: ${slug}`);

const scrapeOptions = {
    all: false,
    titleTags: true,
    metaDescriptions: true,
};

export function generateMetadata() {
    return utils.generateMetadataForEachPage(siteUrl, siteName, page);
}

export default function TitleTagAndMetaDescriptionChecker() {
    return (
        <ClientSeoOnPageChecker
            h1={page.h1}
            metaDescription={page.metaDescription}
            scrapeOptions={scrapeOptions}
        />
    )
}