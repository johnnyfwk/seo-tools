export default function Indexability({ indexability }) {
    if (!indexability) return null;

    const { indexable, reasons = [] } = indexability;

    const indexableIcon = indexable === true 
        ? "✅ URL is Indexable"
        : indexable === false
            ? "❌ URL is Not Indexable"
            : "⚠️ Indexability Unknown";

    return (
        <>
            <p>{indexableIcon}</p>

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
        </>
    );
}
