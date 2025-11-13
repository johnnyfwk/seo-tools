import Link from "next/link";

export default function CanonicalTags({ canonicalTags }) {
    if (canonicalTags.length === 0) return <p>No canonical tags found.</p>

    return (
        <>
            {canonicalTags.length > 1
                ? <p className="error-text">Multiple canonical tags found.</p>
                : null
            }

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>#</th>
                        <th style={{ textAlign: "left" }}>Canonical URL</th>
                        <th style={{ textAlign: "center" }}>Status Code</th>
                        <th style={{ textAlign: "center" }}>Canonical URL matches page URL?</th>
                        <th style={{ textAlign: "left" }}>Issues</th>
                    </tr>
                </thead>
                <tbody>
                    {canonicalTags.map((tag, i) => {
                        return (
                            <tr key={i}>
                                <td style={{ textAlign: "center" }}>{i + 1}</td>

                                <td style={{ textAlign: "left" }}>
                                    <Link
                                        href={tag.resolvedUrl || "#"}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {tag.resolvedUrl || tag.originalUrl || "Invalid URL"}
                                    </Link>
                                </td>

                                <td
                                    style={{ textAlign: "center" }}
                                    className={tag.resolvedUrlStatusCode === 200
                                        ? "success-background"
                                        : "error-background"
                                    }
                                >
                                    {tag.resolvedUrlStatusCode ?? "-"}
                                </td>

                                <td
                                    style={{ textAlign: "center" }}
                                    className={tag.resolvedUrlMatchesOriginalUrl
                                        ? "success-background"
                                        : "warning-background"
                                    }
                                >
                                    {tag.resolvedUrlMatchesOriginalUrl === null
                                        ? "Unknown"
                                        : tag.resolvedUrlMatchesOriginalUrl
                                            ? "Yes"
                                            : "No"
                                    }
                                </td>

                                <td>
                                    {tag.issues.length > 0
                                        ? <ul>
                                            {tag.issues.map((issue, i) => {
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
