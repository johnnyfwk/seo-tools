export default function Viewport({ viewport }) {
    if (!viewport.content) {
        return <p>⚠️ No viewport tag found</p>;
    }

    const issues = [];

    if (!viewport.content.includes("width")) {
        issues.push("Viewport is missing the 'width' property");
    }

    if (!viewport.content.includes("initial-scale")) {
        issues.push("Viewport is missing the 'initial-scale' property");
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return <li key={i}>{issue}</li>
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found</p>
            }

            <table>
                <tbody>
                    <tr style={{ textAlign: "left" }}>
                        <th>Content</th>
                        <td>{viewport.content || "N/A"}</td>
                    </tr>

                    <tr style={{ textAlign: "left" }}>
                        <th>Properties</th>
                        <td>
                            {Object.entries(viewport.properties).map(([key, value]) => (
                                <div key={key}>
                                    <strong>{key}:</strong> {value}
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}