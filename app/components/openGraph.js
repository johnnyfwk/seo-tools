export default function OpenGraph({ openGraph }) {
    if (!openGraph) return null;

    // Check if any OG data exists
    const hasOgData = Object.values(openGraph).some(
        (v) => v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
    );

    if (!hasOgData) {
        return <p>No Open Graph tags found.</p>;
    }

    const expectedFields = Object.keys(openGraph);
    const missingFields = expectedFields.filter((field) => {
        const val = openGraph[field];
        return val === null || val === "" || (Array.isArray(val) && val.length === 0);
    });

    // Helper to render media arrays (images, videos, etc.)
    const renderMediaArray = (key, arr) => arr.map((item, idx) => (
        <tr key={`${key}-${idx}`}>
            <td>
                {key} [{idx + 1}]
            </td>

            <td>
                {key === "image" ? (
                    <div>
                        <a href={item} target="_blank" rel="noopener noreferrer">
                            <img
                                src={item}
                                alt={`OG ${key} preview`}
                                style={{
                                    maxWidth: "150px",
                                    maxHeight: "150px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}
                            />
                            {item}
                        </a>
                    </div>
                ) : (
                    <a href={item} target="_blank" rel="noopener noreferrer">
                        {item}
                    </a>
                )}
            </td>
        </tr>
    ));

    return (
        <div>
            {missingFields.length > 0 && (
                <div>
                    <strong>Missing Open Graph Fields:</strong>
                    <ul>
                        {missingFields.map((field) => (
                        <li key={field}>{field}</li>
                        ))}
                    </ul>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value / URL Info</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(openGraph).map(([key, value]) => {
                        // Handle og:url array with both rawUrl and finalUrl
                        if (key === "url" && Array.isArray(value)) {
                            return value.map((ogUrlObj, idx) => (
                                <tr key={`${key}-${idx}`}>
                                    <td>{key} [{idx + 1}]</td>

                                    <td>
                                        <p>
                                        <strong>Raw URL:</strong>{" "}
                                            {ogUrlObj.visitableRawUrl
                                                ? <a
                                                    href={ogUrlObj.visitableRawUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {ogUrlObj.rawUrl}
                                                </a>
                                                : ogUrlObj.rawUrl || "N/A"
                                            }
                                        </p>

                                        {ogUrlObj.finalUrl && ogUrlObj.finalUrl !== ogUrlObj.rawUrl 
                                            ? <p>
                                                <strong>Final URL:</strong>{" "}
                                                <a
                                                    href={ogUrlObj.finalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {ogUrlObj.finalUrl}
                                                </a>
                                            </p>
                                            : null
                                        }

                                        <p>
                                            <strong>Status Code:</strong> {ogUrlObj.statusCode || "N/A"}
                                        </p>

                                        <p>
                                            <strong>Matches Page Canonical URL:</strong>{" "}
                                            {ogUrlObj.matchesPageCanonical ? "✅" : "❌"}
                                        </p>
                                    </td>
                                </tr>
                            ));
                        }

                        // Handle media arrays like images or videos
                        if ((key === "image" || key === "video") && Array.isArray(value)) {
                            return renderMediaArray(key, value);
                        }

                        // Handle single image/video
                        if ((key === "image" || key === "video") && typeof value === "string") {
                            return renderMediaArray(key, [value]);
                        }

                        if (value === null || value === "") return null;

                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
