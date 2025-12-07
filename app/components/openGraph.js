'use client';

import * as utils from "@/app/lib/utils/utils";

export default function OpenGraph({ openGraph, contentType, xRobotsNoindex }) {
    if (!openGraph) return null;

    // Normalize og:url
    const ogUrls = Array.isArray(openGraph.url)
        ? openGraph.url
        : typeof openGraph.url === "string"
        ? [{ initialUrl: openGraph.url }]
        : [];

    // Check for OG presence
    const hasOgData = Object.values(openGraph).some(
        (v) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
    );
    if (!hasOgData) return <p>No open graph tags found.</p>;

    // Detect missing standard fields
    const expectedOgFields = [
        "title","type","url","description","image","siteName","video","audio","locale"
    ];

    const missingFields = expectedOgFields.filter(field => {
        const val = openGraph[field];
        return val === null || val === "" || (Array.isArray(val) && val.length === 0);
    });

    // Helper: Render media arrays (images/videos) as clickable links
    const renderMediaArray = (label, arr) => arr.map((src, idx) => (
        <tr key={`${label}-${idx}`}>
            <td>{`${label} [${idx + 1}]`}</td>
            <td>
                {label === "image" ? (
                <a href={src} target="_blank" rel="noopener noreferrer">
                    <img
                        src={src}
                        alt=""
                        style={{ maxWidth: "150px", maxHeight: "150px", display: "block" }}
                    />
                    <div>{src}</div>
                </a>
                ) : (
                    <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
                )}
            </td>
        </tr>
    ));

    // Helper: Render a label + clickable URL row
    const renderUrlRow = (label, url) => (
        <div>
            <strong>{label}:</strong>{" "}
            {url ? <a href={url} target="_blank" rel="noopener noreferrer">{url}</a> : "N/A"}
        </div>
    );

    return (
        <>
            {missingFields.length > 0 && (
                <section style={{ marginBottom: "1rem" }}>
                    <h3>Missing Fields:</h3>
                    <ul>{missingFields.map(f => <li key={f}>{f}</li>)}</ul>
                </section>
            )}

            <section>
                <h3>Metadata:</h3>

                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left" }}>Property</th>
                            <th style={{ textAlign: "left" }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* General OG fields except url */}
                        {Object.entries(openGraph).map(([key, value]) => {
                            if (key === "url" || !value) return null;

                            if ((key === "image" || key === "video") && Array.isArray(value))
                            return renderMediaArray(key, value);

                            if ((key === "image" || key === "video") && typeof value === "string")
                            return renderMediaArray(key, [value]);

                            // Make any string starting with http clickable
                            const displayValue = typeof value === "string" && value.startsWith("http")
                                ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                                : value;

                            return (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{displayValue}</td>
                                </tr>
                            );
                        })}

                        {/* og:url entries */}
                        {ogUrls.map((og, idx) => {
                            const finalStatus = og.finalUrlStatusCode ?? og.initialUrlStatusCode;

                            const indexability = utils.evaluateIndexability({
                                statusCode: finalStatus,
                                blockedByRobots: og.robotsTxt?.blocked ?? null,
                                canonicalMatches: og.canonical?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl ?? null,
                                metaRobotsAllowsIndexing: og.metaRobotsAndXRobots?.allowsIndexing ?? null,
                                contentType,
                                xRobotsNoindex,
                            });

                            return (
                            <tr key={`ogurl-${idx}`}>
                                <td>og:url [{idx + 1}]</td>

                                <td>
                                    {renderUrlRow("URL", og.initialUrl)}

                                    <div><strong>Status Code:</strong> {og.initialUrlStatusCode ?? "N/A"}</div>

                                    {og.finalUrl && og.finalUrl !== og.initialUrl && (
                                        <>
                                            {renderUrlRow("Final URL", og.finalUrl)}
                                            <div><strong>Final Status Code:</strong> {og.finalUrlStatusCode ?? "N/A"}</div>
                                        </>
                                    )}

                                    <div>
                                        <strong>Blocked by robots.txt?:</strong>{" "}
                                        {og.robotsTxt?.blocked === null
                                            ? "No robots.txt"
                                            : og.robotsTxt?.blocked
                                                ? "⛔ Yes"
                                                : "✅ No"
                                        }
                                    </div>

                                    <div>
                                        <strong>Meta robots allows indexing?:</strong>{" "}
                                        {og.metaRobotsAndXRobots?.allowsIndexing === null
                                            ? "No meta robots tag"
                                            : og.metaRobotsAndXRobots?.allowsIndexing
                                                ? "✅ Yes"
                                                : "⛔ No"
                                        }
                                    </div>

                                    {renderUrlRow("Canonical URL", og.canonical?.tags?.[0]?.resolvedCanonicalUrl)}

                                    <div>
                                        <strong>Canonical matches URL?:</strong>{" "}
                                        {og.canonical?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true
                                            ? "✅ Yes"
                                            : og.canonical?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === false
                                                ? "⛔ No"
                                                : "N/A"
                                        }
                                    </div>

                                    <div>
                                        <strong>Indexable?:</strong>{" "}
                                        {indexability.indexable === true
                                            ? "✅ Yes"
                                            : indexability.indexable === false
                                                ? "⛔ No"
                                                : "N/A"
                                        }
                                    </div>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </>
    );
}
