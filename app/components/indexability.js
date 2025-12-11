export default function Indexability({ indexability }) {
    if (!indexability) return null;

    const { indexable, reasons = [] } = indexability;

    const indexableIcon = indexable === true 
        ? "✅ URL is indexable"
        : indexable === false
            ? "❌ URL is not indexable"
            : "⚠️ Indexability Unknown";

    return (
        <div>
            <p>{indexableIcon}</p>

            {reasons.length > 0 && (
                <div>
                    <p>
                        <strong>Reason(s):</strong>
                    </p>
                    
                    <ul>
                        {reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
