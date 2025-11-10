import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function CanonicalUrl({ canonicalUrl }) {
    if (!canonicalUrl.url) {
        return <p>No canonical URL found.</p>;
    }

    return (
        <div>
            <p>
                <strong>Canonical URL:</strong>{" "}
                <Link href={canonicalUrl.url} target="_blank" rel="noopener noreferrer">
                    {canonicalUrl.url}
                </Link>
            </p>

            {canonicalUrl.statusCode
                ? <p>
                    <strong>Status Code:</strong> {canonicalUrl.statusCode}
                </p>
                : null
            }

            <p>
                <strong>Self-referential:</strong> {canonicalUrl.isSelfReferential ? "✅ Yes" : "❌ No"}
            </p>

            {canonicalUrl.issues?.length > 0
                ? <details>
                    <summary>
                        <strong>Canonical Issues ({canonicalUrl.issues.length})</strong>
                    </summary>
                    <ul>
                        {canonicalUrl.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                        ))}
                    </ul>
                </details>
                : null
            }
        </div>
    )
}