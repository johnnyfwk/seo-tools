import Link from "next/link";

export default function CanonicalTag({ canonicalTag }) {
    const hasCanonical = !!canonicalTag.url;

    return (
        <div>
            <p>
                <strong>Canonical URL:</strong>{" "}
                {hasCanonical ? (
                    <Link href={canonicalTag.url} target="_blank" rel="noopener noreferrer">
                        {canonicalTag.url}
                    </Link>
                ) : (
                    "None (page is self-referential by default)"
                )}
            </p>

            {canonicalTag.statusCode && hasCanonical && (
                <p>
                    <strong>Status Code:</strong> {canonicalTag.statusCode}
                </p>
            )}

            <p>
                <strong>Self-referential:</strong>{" "}
                {canonicalTag.isSelfReferential ? "✅ Yes" : "❌ No"}
            </p>

            {canonicalTag.issues?.length > 0 && (
                <div>
                    <strong>Issues ({canonicalTag.issues.length}):</strong>
                    <ul>
                        {canonicalTag.issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
