import * as utils from '@/app/lib/utils/utils';

export default function OpenGraph({ openGraph }) {
    if (!openGraph) return null;

    const hasOgData = Object.values(openGraph).some(
        (v) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
    );

    if (!hasOgData) {
        return <p>No Open Graph tags found.</p>;
    }

    // --- Missing OG fields ---
    const expectedOgFields = [
        "title",
        "type",
        "url",
        "description",
        "image",
        "siteName",
        "video",
        "audio",
        "locale",
    ];

    const missingFields = expectedOgFields.filter((field) => {
        const val = openGraph[field];
        return val === null || val === "" || (Array.isArray(val) && val.length === 0);
    });

    const renderMediaArray = (label, values) =>
        values.map((item, idx) => (
            <tr key={`${label}-${idx}`}>
                <td>{label} [{idx + 1}]</td>
                <td>
                    {label === "image" ? (
                        <a href={item} target="_blank" rel="noopener noreferrer">
                            <img
                                src={item}
                                alt=""
                                style={{ maxWidth: "150px", maxHeight: "150px" }}
                            />
                            <div>{item}</div>
                        </a>
                    ) : (
                        <a href={item} target="_blank" rel="noopener noreferrer">{item}</a>
                    )}
                </td>
            </tr>
        ));

    return (
        <div>
            {/* Missing OG fields */}
            {missingFields.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                    <strong>Missing Open Graph Fields:</strong>
                    <ul>
                        {missingFields.map((field) => (
                            <li key={field}>{field}</li>
                        ))}
                    </ul>
                </div>
            )}

            <strong>Open Graph Metadata</strong>

            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(openGraph).map(([key, value]) => {
                        if (key === "url") return null;
                        if (!value) return null;

                        if ((key === "image" || key === "video") && Array.isArray(value)) {
                            return renderMediaArray(key, value);
                        }

                        if ((key === "image" || key === "video") && typeof value === "string") {
                            return renderMediaArray(key, [value]);
                        }

                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                    
                    {Array.isArray(openGraph.url) &&
                        openGraph.url.map((og, idx) => {
                            // Compute indexability
                            const indexability = utils.evaluateIndexability({
                                statusCode: og.finalUrlStatusCode ?? og.initialUrlStatusCode,
                                blockedByRobots: og.robotsTxt?.blocked ?? null,
                                canonicalMatches: og.canonical?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl ?? null,
                                metaRobotsAllowsIndexing: og.metaRobots?.allowsIndexing ?? null
                            });

                            return (
                                <tr key={`ogurl-${idx}`}>
                                    <td>og:url [{idx + 1}]</td>

                                    <td>
                                        {/* RAW URL */}
                                        <div>
                                            <strong>URL:</strong>{" "}
                                            <a href={og.initialUrl} target="_blank" rel="noopener noreferrer">
                                                {og.initialUrl}
                                            </a>
                                        </div>

                                        <div>
                                            <strong>Status Code:</strong>{" "}
                                            {og.initialUrlStatusCode ?? "N/A"}
                                        </div>

                                        {/* FINAL URL */}
                                        {og.finalUrl && og.finalUrl !== og.initialUrl && (
                                            <>
                                                <div>
                                                    <strong>Final URL:</strong>{" "}
                                                    <a href={og.finalUrl} target="_blank" rel="noopener noreferrer">
                                                        {og.finalUrl}
                                                    </a>
                                                </div>

                                                <div>
                                                    <strong>Final URL Status Code:</strong>{" "}
                                                    {og.finalUrlStatusCode ?? "N/A"}
                                                </div>
                                            </>
                                        )}

                                        {/* robots.txt */}
                                        {og.robotsTxt && (
                                            <div>
                                                <strong>Blocked by robots.txt?:</strong>{" "}
                                                {og.robotsTxt.blocked === null
                                                    ? "No robots.txt"
                                                    : og.robotsTxt.blocked
                                                        ? "⛔ Yes"
                                                        : "✅ No"
                                                }
                                            </div>
                                        )}

                                        {/* meta robots */}
                                        {og.metaRobots && (
                                            <div>
                                                <strong>Meta robots tag allows indexing?:</strong>{" "}
                                                {og.metaRobots.allowsIndexing === null
                                                    ? "No meta robots tag"
                                                    : og.metaRobots.allowsIndexing
                                                        ? "✅ Yes"
                                                        : "⛔ No"
                                                }
                                            </div>
                                        )}

                                        {/* canonical */}
                                        {og.canonical && (
                                            <>
                                                <div>
                                                    <strong>Canonical URL:</strong>{" "}
                                                    {og.canonical.tags?.[0]?.resolvedCanonicalUrl
                                                        ? (
                                                            <a
                                                                href={
                                                                    og.canonical.tags[0].resolvedCanonicalUrl
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {og.canonical.tags[0].resolvedCanonicalUrl}
                                                            </a>
                                                        )
                                                        : "No canonical tag"
                                                    }
                                                </div>

                                                <div>
                                                    <strong>URL matches canonical URL?:</strong>{" "}
                                                    {og.canonical.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === null
                                                        ? "N/A"
                                                        : og.canonical.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true
                                                            ? "✅ Yes"
                                                            : "⛔ No"
                                                    }
                                                </div>
                                            </>
                                        )}

                                        {/* INDEXABILITY */}
                                        <div>
                                            <strong>Indexable?:</strong>{" "}
                                            {indexability.indexable
                                                ? "✅ Yes"
                                                : "⛔ No"
                                            }
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
