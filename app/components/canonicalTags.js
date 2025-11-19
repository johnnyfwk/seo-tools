import Link from "next/link";

export default function CanonicalTags({ canonicalTags }) {
    const safe = {
        tags: canonicalTags?.tags || [],
        globalIssues: canonicalTags?.globalIssues || [],
    };

    if (safe.tags.length === 0) return <p>No canonical tags found.</p>;

    return (
        <>
            {canonicalTags.globalIssues?.length > 0
                ? <div>
                    <p>
                        <strong>Global canonical issues</strong>:
                    </p>
                    <ul>
                        {canonicalTags.globalIssues?.map((issue, i) => {
                            return (
                                <li key={i}>{issue}</li>
                            )
                        })}
                    </ul>
                </div>
                : null
            }

            {canonicalTags.tags?.length > 1
                ? <p className="error-text">Multiple canonical tags found.</p>
                : null
            }

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th style={{ textAlign: "left" }}>Canonical URL</th>
                        <th style={{ textAlign: "center" }}>Status Code</th>
                        <th style={{ textAlign: "center" }}>Canonical URL matches entered URL?</th>
                        <th style={{ textAlign: "left" }}>Issues</th>
                    </tr>
                </thead>
                <tbody>
                    {canonicalTags.tags?.map((tag, i) => {
                        return (
                            <tr key={i}>
                                <td style={{ textAlign: "center" }}>{i + 1}</td>

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
                                    className={tag.resolvedCanonicalUrlStatusCode === 200
                                        ? 'success-background'
                                        : tag.resolvedCanonicalUrlStatusCode >= 300 && tag.resolvedCanonicalUrlStatusCode < 400
                                            ? 'warning-background'
                                            : tag.resolvedCanonicalUrlStatusCode >= 400
                                                ? 'error-background'
                                                : ''
                                    }
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
                                            : "Unknown"
                                    }
                                </td>

                                <td>
                                    {tag.issues?.length > 0
                                        ? <ul>
                                            {tag.issues?.map((issue, i) => {
                                                return (
                                                    <li
                                                        key={i}
                                                        style={{ textAlign: "left" }}
                                                    >{issue}</li>
                                                )
                                            })}
                                        </ul>
                                        : "-"
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    );
}
