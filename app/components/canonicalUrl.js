import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function CanonicalUrl({ enteredUrl, canonicalUrl }) {
    if (!canonicalUrl) {
        return <p>⚠️ No canonical tag found. The entered URL is indexable by default.</p>;
    }

    if (!enteredUrl) {
        return <p>⚠️ Entered URL is not available.</p>;
    }

    const enteredNorm = utils.normaliseUrlKeepSearch(enteredUrl);
    const canonicalNorm = utils.normaliseUrlKeepSearch(canonicalUrl);
    
    const isSelfReferencing = enteredNorm === canonicalNorm;

    return (
        <div>
            <p>
                <Link
                    href={canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >{canonicalUrl}</Link>
            </p>

            <p>
                <strong>Entered URL is indexable?: </strong>
                {isSelfReferencing
                    ? "✅ Yes, the canonical URL matches the entered URL."
                    : `❌ No, the canonical URL points to a different URL.`
                }
            </p>
        </div>
    )
}