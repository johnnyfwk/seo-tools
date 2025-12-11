export default function Viewport({ viewport }) {
    if (!viewport.content) {
        return <p>No viewport tag found.</p>;
    }

    const requiredProps = ['width', 'initial-scale'];
    const missingRequired = requiredProps.filter(prop => !viewport.properties[prop]);

    return (
        <div>
            {missingRequired.length === 0
                ? <p>✅ Includes required properties: <strong><em>width</em></strong> and <strong><em>initial-scale</em></strong>.</p>
                : <p>❌ Missing required viewport properties: {missingRequired.join(', ')}</p>
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
                            <ul>
                                {Object.entries(viewport.properties).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}