import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function Pagination({ pagination }) {
    if (!pagination || pagination.length === 0) {
        return <p>No pagination links found.</p>;
    }

    const issues = [];

    const nullStatusCodeLinks = pagination.filter((p) => p.initialUrlStatusCode === null);
    const non200links = pagination.filter((p) => p.initialUrlStatusCode !== null && p.initialUrlStatusCode !== 200);
    const nonMatchingCanonicalUrls = pagination.filter((p) => p.canonicalTags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === false);

    if (nullStatusCodeLinks.length > 0) {
        if (nullStatusCodeLinks.length === 1) {
            issues.push("1 link status code could not be fetched");
        } else if (nullStatusCodeLinks.length > 1) {
            issues.push(`${nullStatusCodeLinks.length} link status codes could not be fetched`);
        }
    }

    if (non200links.length > 0) {
        if (non200links.length === 1) {
            issues.push(`1 link returns a non-200 status code`);
        } else if (non200links.length > 1) {
            issues.push(`${non200links.length} links return a non-200 status code`);
        }
    }

    if (nonMatchingCanonicalUrls.length > 0) {
        if (nonMatchingCanonicalUrls.length === 1) {
            issues.push(`1 link doesn't have a matching canonical URL`);
        } else if (nonMatchingCanonicalUrls.length > 1) {
            issues.push(`${nonMatchingCanonicalUrls.length } links don't have matching canonical URLs`);
        }
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return <li key={i}>{issue}</li>
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }

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
                        <th style={{ textAlign: 'center' }}>Canonical URL matches URL/Final URL?</th>
                    </tr>
                </thead>
                <tbody>
                    {pagination.map((p, i) => {
                        const canonicalUrlMatchesUrlTextAndClass = p.canonicalTags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true
                            ? { text: "Yes", class: "success-background" }
                            : p.canonicalTags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === false
                                ? { text: "No", class: "error-background" }
                                : { text: "N/A", class: "" }

                        return (
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

                                <td style={{ textAlign: "left" }}>
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

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={canonicalUrlMatchesUrlTextAndClass.class}
                                >
                                    {canonicalUrlMatchesUrlTextAndClass.text}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
