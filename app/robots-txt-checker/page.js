import ClientRobotsTxtChecker from "../clientPages/clientRobotsTxtChecker";

import { getSlugFromFile } from "../lib/utils/utils";
import { pages } from "@/data/pages";

const slug = getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

export const metadata = {
    title: page.titleTag,
    description: page.metaDescription,
}

export default function RobotsTxtChecker() {
    return (
        <ClientRobotsTxtChecker
            metaDescription={page.metaDescription}
        />
    )
}