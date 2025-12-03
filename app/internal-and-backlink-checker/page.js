import ClientInternalAndBacklinkChecker from "../clientPages/clientInternalAndBacklinkChecker";
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

// export default function InternalAndBacklinkChecker() {
//     return (
//         <ClientInternalAndBacklinkChecker
//             metaDescription={page.metaDescription}
//         />
//     )
// }

export default function InternalAndBacklinkChecker() {
    return <p>Page under construction.</p>
}