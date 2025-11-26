export default function Indexability({ indexability, contentType, isHtml, isPdf, isImage, isOther }) {
    if (!indexability) return null;

    const { indexable, reasons = [] } = indexability;

    // Determine human-readable resource type
    let resourceType = "Unknown";
    if (isHtml) resourceType = "HTML Page";
    else if (isPdf) resourceType = "PDF Document";
    else if (isImage) resourceType = "Image File";
    else if (isOther) resourceType = "Other File Type";

    const indexableIcon = indexable === true 
        ? "✅ URL is Indexable"
        : indexable === false
            ? "❌ URL is Not Indexable"
            : "⚠️ Indexability Unknown";

    return (
        <div className="indexability-box">
            <h3>{indexableIcon}</h3>

            <p><strong>Content-Type:</strong> {contentType || "Unknown"}</p>
            <p><strong>Detected Resource Type:</strong> {resourceType}</p>

            {reasons.length > 0 && (
                <div>
                    <strong>Reason(s):</strong>
                    <ul>
                        {reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            {isOther && (
                <p>
                    Canonical tags and meta robots tags do not apply to this resource type.
                </p>
            )}
        </div>
    );
}
