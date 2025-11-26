export default function Indexability({ indexability }) {
    // console.log("indexability:", indexability);

    return (
        <div>
            <p>
                {indexability.indexable === true
                    ? "✅ URL is Indexable"
                    : indexability.indexable === false
                        ? "❌ URL is Not Indexable "
                        : "ℹ️ Unknown"
                    
                }
            </p>

            {indexability.reasons.length > 0
                ? <>
                    <p>
                        <strong>Reason(s):</strong>
                    </p>
                    <ul>
                        {indexability.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                        ))}
                    </ul>
                </>
                : null
            }
        </div>
    );
}