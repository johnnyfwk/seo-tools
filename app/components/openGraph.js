// import * as utils from '@/app/lib/utils/utils';

// export default function OpenGraph({ openGraph }) {
//     if (!openGraph) return null;

//     const hasOgData = Object.values(openGraph).some(
//         (v) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
//     );

//     if (!hasOgData) {
//         return <p>No Open Graph tags found.</p>;
//     }

//     // --- Missing OG fields ---
//     const expectedOgFields = [
//         "title",
//         "type",
//         "url",
//         "description",
//         "image",
//         "siteName",
//         "video",
//         "audio",
//         "locale",
//     ];

//     const missingFields = expectedOgFields.filter((field) => {
//         const val = openGraph[field];
//         return val === null || val === "" || (Array.isArray(val) && val.length === 0);
//     });

//     const renderMediaArray = (label, values) =>
//         values.map((item, idx) => (
//             <tr key={`${label}-${idx}`}>
//                 <td>{label} [{idx + 1}]</td>
//                 <td>
//                     {label === "image" ? (
//                         <a href={item} target="_blank" rel="noopener noreferrer">
//                             <img
//                                 src={item}
//                                 alt=""
//                                 style={{ maxWidth: "150px", maxHeight: "150px" }}
//                             />
//                             <div>{item}</div>
//                         </a>
//                     ) : (
//                         <a href={item} target="_blank" rel="noopener noreferrer">{item}</a>
//                     )}
//                 </td>
//             </tr>
//         ));

//     return (
//         <div>
//             {/* Missing OG fields */}
//             {missingFields.length > 0 && (
//                 <div style={{ marginBottom: "1rem" }}>
//                     <strong>Missing Open Graph Fields:</strong>
//                     <ul>
//                         {missingFields.map((field) => (
//                             <li key={field}>{field}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             <strong>Open Graph Metadata</strong>

//             <table>
//                 <thead>
//                     <tr>
//                         <th style={{ textAlign: "left"}}>Property</th>
//                         <th style={{ textAlign: "left"}}>Value</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {Object.entries(openGraph).map(([key, value]) => {
//                         if (key === "url") return null;
//                         if (!value) return null;

//                         if ((key === "image" || key === "video") && Array.isArray(value)) {
//                             return renderMediaArray(key, value);
//                         }

//                         if ((key === "image" || key === "video") && typeof value === "string") {
//                             return renderMediaArray(key, [value]);
//                         }

//                         return (
//                             <tr key={key}>
//                                 <td>{key}</td>
//                                 <td>{value}</td>
//                             </tr>
//                         );
//                     })}
                    
//                     {Array.isArray(openGraph.url) &&
//                         openGraph.url.map((og, idx) => {
//                             // Compute indexability
//                             const indexability = utils.evaluateIndexability({
//                                 statusCode: og.finalUrlStatusCode ?? og.initialUrlStatusCode,
//                                 blockedByRobots: og.robotsTxt?.blocked ?? null,
//                                 canonicalMatches: og.canonical?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl ?? null,
//                                 metaRobotsAllowsIndexing: og.metaRobots?.allowsIndexing ?? null
//                             });

//                             return (
//                                 <tr key={`ogurl-${idx}`}>
//                                     <td>og:url [{idx + 1}]</td>

//                                     <td>
//                                         {/* RAW URL */}
//                                         <div>
//                                             <strong>URL:</strong>{" "}
//                                             <a href={og.initialUrl} target="_blank" rel="noopener noreferrer">
//                                                 {og.initialUrl}
//                                             </a>
//                                         </div>

//                                         <div>
//                                             <strong>Status Code:</strong>{" "}
//                                             <span>{og.initialUrlStatusCode ?? "N/A"}</span>
//                                         </div>

//                                         {/* FINAL URL */}
//                                         {og.finalUrl && og.finalUrl !== og.initialUrl && (
//                                             <>
//                                                 <div>
//                                                     <strong>Final URL:</strong>{" "}
//                                                     <a href={og.finalUrl} target="_blank" rel="noopener noreferrer">
//                                                         {og.finalUrl}
//                                                     </a>
//                                                 </div>

//                                                 <div>
//                                                     <strong>Final URL Status Code:</strong>{" "}
//                                                     <span>{og.finalUrlStatusCode ?? "N/A"}</span>
//                                                 </div>
//                                             </>
//                                         )}

//                                         {/* robots.txt */}
//                                         <div>
//                                             <strong>Blocked by robots.txt?:</strong>{" "}
//                                             {og.robotsTxt
//                                                 ? og.robotsTxt.blocked === null
//                                                     ? <span>No robots.txt</span>
//                                                     : og.robotsTxt.blocked === true
//                                                         ? <span>⛔ Yes</span>
//                                                         : <span>✅ No</span>
//                                                 : <span>N/A</span>
//                                             }
//                                         </div>

//                                         {/* meta robots */}
//                                         <div>
//                                             <strong>Meta robots tag allows indexing?:</strong>{" "}
//                                             {og.metaRobots
//                                                 ? og.metaRobots.allowsIndexing === null
//                                                     ? <span>No meta robots tag</span>
//                                                     : og.metaRobots.allowsIndexing === true
//                                                         ? <span>✅ Yes</span>
//                                                         : <span>⛔ No</span>
//                                                 : <span>N/A</span>
//                                             }
//                                         </div>

//                                         {/* canonical */}
//                                         <div>
//                                             <strong>Canonical URL:</strong>{" "}
//                                             {og.canonical
//                                                 ? og.canonical.tags?.[0]?.resolvedCanonicalUrl
//                                                     ? <a
//                                                         href={og.canonical.tags[0].resolvedCanonicalUrl}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                     >
//                                                         {og.canonical.tags[0].resolvedCanonicalUrl}
//                                                     </a>
//                                                     : <span>No canonical tag.</span>
//                                                 : <span>N/A</span>
//                                             }
//                                         </div>

//                                         <div>
//                                             <strong>URL matches canonical URL?:</strong>{" "}
//                                             {og.canonical
//                                                 ? og.canonical.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === null
//                                                     ? <span>N/A</span>
//                                                     : og.canonical.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true
//                                                         ? <span>✅ Yes</span>
//                                                         : <span>⛔ No</span>
//                                                 : <span>N/A</span>
//                                             }
//                                         </div>

//                                         {/* INDEXABILITY */}
//                                         <div>
//                                             <strong>Indexable?:</strong>{" "}
//                                             {indexability.indexable
//                                                 ? <span>✅ Yes</span>
//                                                 : <span>⛔ No</span>
//                                             }
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                 </tbody>
//             </table>
//         </div>
//     );
// }



import * as utils from "@/app/lib/utils/utils";

export default function OpenGraph({ openGraph }) {
    if (!openGraph) return null;

    // ------------------------------
    // Normalize the og:url structure
    // ------------------------------
    let ogUrls = [];
    if (Array.isArray(openGraph.url)) {
        ogUrls = openGraph.url;
    } else if (typeof openGraph.url === "string") {
        ogUrls = [{ initialUrl: openGraph.url }];
    }

    // ------------------------------
    // Check for OG presence
    // ------------------------------
    const hasOgData = Object.values(openGraph).some(
        (v) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
    );

    if (!hasOgData) {
        return <p>No Open Graph tags found.</p>;
    }

    // ------------------------------
    // Detect missing standard fields
    // ------------------------------
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

    // ------------------------------
    // Helper: Render media tables
    // ------------------------------
    const renderMediaArray = (label, arr) =>
        arr.map((src, idx) => (
            <tr key={`${label}-${idx}`}>
                <td>{label} [{idx + 1}]</td>
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

    return (
        <div>

            {/* ------------------------------ */}
            {/* Missing OG Fields               */}
            {/* ------------------------------ */}
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
                        <th style={{ textAlign: "left" }}>Property</th>
                        <th style={{ textAlign: "left" }}>Value</th>
                    </tr>
                </thead>

                <tbody>
                    {/* -------------------------------- */}
                    {/* General OG fields except og:url   */}
                    {/* -------------------------------- */}
                    {Object.entries(openGraph).map(([key, value]) => {
                        // Skip URL — handled separately below
                        if (key === "url") return null;
                        if (!value) return null;

                        // Handle arrays of images/videos
                        if ((key === "image" || key === "video") && Array.isArray(value)) {
                            return renderMediaArray(key, value);
                        }

                        // Handle single media as string
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

                    {/* -------------------------------- */}
                    {/* og:url rows                      */}
                    {/* -------------------------------- */}
                    {ogUrls.length > 0 &&
                        ogUrls.map((og, idx) => {
                            const finalStatus = og.finalUrlStatusCode ?? og.initialUrlStatusCode;

                            // Compute indexability
                            const indexability = utils.evaluateIndexability({
                                statusCode: finalStatus,
                                blockedByRobots: og.robotsTxt?.blocked ?? null,
                                canonicalMatches:
                                    og.canonical?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl ??
                                    null,
                                metaRobotsAllowsIndexing:
                                    og.metaRobots?.allowsIndexing ?? null,
                            });

                            return (
                                <tr key={`ogurl-${idx}`}>
                                    <td>og:url [{idx + 1}]</td>
                                    <td>
                                        {/* RAW URL */}
                                        {og.initialUrl && (
                                            <div>
                                                <strong>URL:</strong>{" "}
                                                <a
                                                    href={og.initialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {og.initialUrl}
                                                </a>
                                            </div>
                                        )}

                                        <div>
                                            <strong>Status Code:</strong>{" "}
                                            {og.initialUrlStatusCode ?? "N/A"}
                                        </div>

                                        {/* FINAL URL */}
                                        {og.finalUrl && og.finalUrl !== og.initialUrl && (
                                            <>
                                                <div>
                                                    <strong>Final URL:</strong>{" "}
                                                    <a
                                                        href={og.finalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {og.finalUrl}
                                                    </a>
                                                </div>

                                                <div>
                                                    <strong>Final URL Status Code:</strong>{" "}
                                                    {og.finalUrlStatusCode ?? "N/A"}
                                                </div>
                                            </>
                                        )}

                                        {/* Robots.txt */}
                                        <div>
                                            <strong>Blocked by robots.txt?:</strong>{" "}
                                            {og.robotsTxt
                                                ? og.robotsTxt.blocked === null
                                                    ? "No robots.txt"
                                                    : og.robotsTxt.blocked === true
                                                        ? "⛔ Yes"
                                                        : "✅ No"
                                                : "N/A"}
                                        </div>

                                        {/* Meta robots */}
                                        <div>
                                            <strong>Meta robots allows indexing?:</strong>{" "}
                                            {og.metaRobots
                                                ? og.metaRobots.allowsIndexing === null
                                                    ? <span>No meta robots tag</span>
                                                    : og.metaRobots.allowsIndexing === true
                                                        ? <span>✅ Yes</span>
                                                        : <span>⛔ No</span>
                                                : <span>N/A</span>
                                            }
                                        </div>

                                        {/* Canonical */}
                                        <div>
                                            <strong>Canonical URL:</strong>{" "}
                                            {og.canonical?.tags?.[0]?.resolvedCanonicalUrl
                                                ? <a
                                                    href={
                                                        og.canonical.tags[0].resolvedCanonicalUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {og.canonical.tags[0].resolvedCanonicalUrl}
                                                </a>
                                                : <span>No canonical tag</span>
                                            }
                                        </div>

                                        {/* Canonical match */}
                                        <div>
                                            <strong>URL matches canonical?:</strong>{" "}
                                            {og.canonical
                                                ? og.canonical.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true
                                                    ? <span>✅ Yes</span>
                                                    : og.canonical.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === false
                                                        ? <span>⛔ No</span>
                                                        : <span>N/A</span>
                                                : <span>N/A</span>
                                            }
                                        </div>

                                        {/* Indexability */}
                                        <div>
                                            <strong>Indexable?:</strong>{" "}
                                            {indexability.indexable ? "✅ Yes" : "⛔ No"}
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
