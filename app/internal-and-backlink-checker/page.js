import ClientInternalAndBacklinkChecker from "../clientPages/clientInternalAndBacklinkChecker";
import { getSlugFromFile } from "../lib/utils/utils";
import { siteUrl, siteName, pages } from "@/data/pages";
import * as utils from '@/app/lib/utils/utils';

const slug = getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

if (!page) throw new Error(`Page not found: ${slug}`);

export function generateMetadata() {
    return utils.generateMetadataForEachPage(siteUrl, siteName, page);
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