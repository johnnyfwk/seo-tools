import Link from "next/link";

export default function Pagination({ pagination }) {
    if (pagination.length === 0) {
        return <p>No pagination links found.</p>
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
                {pagination.map((p, i) => {
                    return (
                        <tr key={i}>
                            <td style={{ textAlign: 'center' }}>{i + 1}</td>

                            <td style={{ textAlign: 'left' }}>{p.anchorText}</td>

                            <td style={{ textAlign: 'left' }}>
                                <Link href={p.url} target="_blank" rel="noreferrer noopener">
                                    {p.url}
                                </Link>
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={p.statusCode === 200
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {p.statusCode}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {p.canonicalUrl
                                    ? <Link
                                        href={p.canonicalUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {p.canonicalUrl}
                                    </Link>
                                    : "Not Found"
                                }
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {p.statusCode === 200
                                    ? "-"
                                    : <Link href={p.finalUrl} target="_blank" rel="noreferrer noopener">
                                        {p.finalUrl}
                                    </Link>
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={p.statusCode === 200
                                    ? ""
                                    : p.finalUrlStatusCode === 200
                                        ? "success-background"
                                        : "error-background"
                                }
                            >
                                {p.statusCode === 200
                                    ? "-"
                                    : p.finalUrlStatusCode
                                }
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {p.statusCode === 200
                                    ? "-"
                                    : p.finalUrlCanonicalUrl
                                        ? <Link
                                            href={p.finalUrlCanonicalUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            {p.finalUrlCanonicalUrl}
                                        </Link>
                                        : "Not Found"
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}