import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

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
                    <th style={{ textAlign: 'left' }}>Final URL</th>
                    <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
                    <th style={{ textAlign: 'left' }}>Canonical URL</th>
                </tr>
            </thead>
            <tbody>
                {pagination.map((p, i) => (
                    <tr key={i}>
                        <td style={{ textAlign: 'center' }}>{i + 1}</td>

                        <td style={{ textAlign: 'left' }}>{p.anchorText || "(no text)"}</td>

                        <td style={{ textAlign: 'left' }}>
                            {p.initialUrl
                                ? <Link href={p.initialUrl} target="_blank" rel="noreferrer noopener">
                                    {p.initialUrl}
                                </Link>
                                : "N/A"
                            }
                        </td>

                        <td
                            style={{ textAlign: 'center' }}
                            className={utils.getInitialUrlStatusCodeClass(p.initialUrlStatusCode)}
                        >
                            {p.initialUrlStatusCode ?? "N/A"}
                        </td>

                        <td style={{ textAlign: 'left' }}>
                            {p.initialUrlStatusCode >= 200 && p.initialUrlStatusCode < 300
                                ? "-"
                                : p.finalUrl
                                    ? <a
                                        href={p.finalUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {p.finalUrl}
                                    </a>
                                    : "N/A"
                            }
                        </td>

                        <td
                            style={{ textAlign: 'center' }}
                            className={utils.getFinalUrlStatusCodeTextAndClass(
                                p.initialUrlStatusCode,
                                p.finalUrlStatusCode
                            ).class}
                        >
                            {utils.getFinalUrlStatusCodeTextAndClass(
                                p.initialUrlStatusCode,
                                p.finalUrlStatusCode
                            ).text}
                        </td>

                        <td style={{ textAlign: 'left' }}>
                            {p.canonicalTags?.[0]?.resolvedCanonicalUrl
                                ? <Link
                                    href={p.canonicalTags[0].resolvedCanonicalUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {p.canonicalTags[0].resolvedCanonicalUrl}
                                </Link>
                                : "N/A"
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
