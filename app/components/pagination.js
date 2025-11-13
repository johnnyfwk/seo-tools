import Link from "next/link";

export default function Pagination({ pagination }) {
    if (!pagination || pagination.length === 0) {
        return <p>No pagination links found.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                <th style={{ textAlign: 'center' }}>#</th>
                <th style={{ textAlign: 'left' }}>Text</th>
                <th style={{ textAlign: 'left' }}>URL</th>
                <th style={{ textAlign: 'center' }}>Status Code</th>
                <th style={{ textAlign: 'left' }}>Canonical URL</th>
                <th style={{ textAlign: 'left' }}>Final URL</th>
                <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
                <th style={{ textAlign: 'left' }}>Final URL Canonical URL</th>
                </tr>
            </thead>
            <tbody>
                {pagination.map((p, i) => (
                    <tr key={i}>
                        <td style={{ textAlign: 'center' }}>{i + 1}</td>

                        <td style={{ textAlign: 'left' }}>{p.anchorText || "(no text)"}</td>

                        <td style={{ textAlign: 'left' }}>
                            <Link href={p.url} target="_blank" rel="noreferrer noopener">
                                {p.url}
                            </Link>
                        </td>

                        <td
                            style={{ textAlign: 'center' }}
                            className={
                                p.statusCode >= 200 && p.statusCode < 400
                                ? "success-background"
                                : "error-background"
                            }
                        >
                            {p.statusCode ?? "N/A"}
                        </td>

                        <td style={{ textAlign: 'left' }}>
                            {p.canonicalTags?.[0]?.resolvedUrl ? (
                                <Link
                                    href={p.canonicalTags[0].resolvedUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {p.canonicalTags[0].resolvedUrl}
                                </Link>
                            ) : (
                                "-"
                            )}
                        </td>

                        <td style={{ textAlign: 'left' }}>
                            {p.statusCode !== 200 && p.finalUrl ? (
                                <Link href={p.finalUrl} target="_blank" rel="noreferrer noopener">
                                    {p.finalUrl}
                                </Link>
                            ) : (
                                "-"
                            )}
                        </td>

                        <td
                            style={{ textAlign: 'center' }}
                            className={
                                p.statusCode !== 200
                                    ? p.finalUrlStatusCode >= 200 && p.finalUrlStatusCode < 400
                                        ? "success-background"
                                        : "error-background"
                                    : ""
                            }
                        >
                            {p.statusCode !== 200
                                ? p.finalUrlStatusCode ?? "N/A"
                                : "-"}
                        </td>

                        <td style={{ textAlign: 'left' }}>
                            {p.statusCode !== 200 && p.finalUrlCanonicalUrl ? (
                                <Link
                                    href={p.finalUrlCanonicalUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {p.finalUrlCanonicalUrl}
                                </Link>
                            ) : (
                                "-"
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
