import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function CanonicalTags({ canonicalTags, finalUrl }) {
    const issues = [];

    if (canonicalTags.tags?.length === 0) {
        return <p>No canonical tag found.</p>;
    }

    if (canonicalTags.tags?.length > 1) {
        issues.push(`Multiple (${canonicalTags.tags?.length}) canonical tags found`);
    }

    if (canonicalTags.tags?.[0]?.resolvedCanonicalUrlStatusCode !== 200) {
        issues.push("Canonical URL status code is not 200");
    }

    if (!canonicalTags.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl) {
        issues.push("Canonical URL does not match URL");
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Potential issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return (
                                <li key={i}>{issue}</li>
                            )
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th style={{ textAlign: "left" }}>URL</th>
                        <th style={{ textAlign: "left" }}>Canonical URL</th>
                        <th style={{ textAlign: "center" }}>Status Code</th>
                        <th style={{ textAlign: "center" }}>Canonical URL matches URL?</th>
                    </tr>
                </thead>
                <tbody>
                    {canonicalTags.tags?.map((tag, i) => {
                        return (
                            <tr key={i}>
                                <td style={{ textAlign: "center" }}>{i + 1}</td>

                                <td style={{ textAlign: "left" }}>
                                    <Link
                                        href={finalUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {finalUrl || "Invalid URL"}
                                    </Link>
                                </td>

                                <td style={{ textAlign: "left" }}>
                                    <Link
                                        href={tag.resolvedCanonicalUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {tag.originalUrl || "Invalid URL"}
                                    </Link>
                                </td>

                                <td
                                    style={{ textAlign: "center" }}
                                    className={utils.getInitialUrlStatusCodeClass(tag.resolvedCanonicalUrlStatusCode)}
                                >
                                    {tag.resolvedCanonicalUrlStatusCode ?? "-"}
                                </td>

                                <td
                                    style={{ textAlign: "center" }}
                                    className={tag.resolvedCanonicalUrlMatchesOriginalUrl === true
                                        ? 'success-background'
                                        : tag.resolvedCanonicalUrlMatchesOriginalUrl === false
                                            ? 'warning-background'
                                            : ''
                                    }
                                >
                                    {tag.resolvedCanonicalUrlMatchesOriginalUrl === true
                                        ? "Yes"
                                        : tag.resolvedCanonicalUrlMatchesOriginalUrl === false
                                            ? "No"
                                            : "N/A"
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}
