export default function Viewport({ viewport }) {
    if (!viewport.content) {
        return <p>No viewport tag found.</p>;
    }

    const requiredProps = ['width', 'initial-scale'];
    const missingRequired = requiredProps.filter(prop => !viewport.properties[prop]);

    return (
        <>
            <div>
                <p>
                    <strong>Raw Content:</strong> <code>{viewport.content}</code>
                </p>
            </div>

            <div>
                <p>
                    <strong>Properties:</strong>
                </p>
                <ul>
                    {Object.entries(viewport.properties).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                {missingRequired.length === 0
                    ? <p>✅ Includes required properties: <em>width</em> and <em>initial-scale</em>.</p>
                    : <p>
                        ❌ Missing required viewport properties: {missingRequired.join(', ')}
                    </p>
                }

                {!viewport.properties['user-scalable']
                    ? <p>⚠️ Consider setting <em>user-scalable</em> to improve mobile accessibility.</p>
                    : null
                }

                {!viewport.properties['maximum-scale']
                    ? <p>⚠️ Consider setting <em>maximum-scale</em> to prevent unwanted zooming if needed.</p>
                    : null
                }
            </div>
        </>
    )
}