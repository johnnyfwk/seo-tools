import ClientSeoOnPageChecker from "../clientPages/clientSeoOnPageChecker";
import { getSlugFromFile } from "../lib/utils/utils";
import { pages } from "@/data/pages";

const slug = getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

export const metadata = {
    title: page.titleTag,
    description: page.metaDescription,
    alternates: {
        canonical: page.canonicalUrl,
    },
}

const scrapeOptions = {
    all: false,
    canonicalTags: true,
}

export default function CanonicalTagChecker() {
    return (
        <ClientSeoOnPageChecker
            h1={page.h1}
            metaDescription={page.metaDescription}
            scrapeOptions={scrapeOptions}
        />
    )
}