import ClientSeoOnPageChecker from "../clientPages/clientSeoOnPageChecker";
import { getSlugFromFile } from "../lib/utils/utils";
import { pages } from "@/data/pages";

const slug = getSlugFromFile(import.meta.url);

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
}

const scrapeOptions = {
    all: false,
    titleTags: true,
    metaDescriptions: true,
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