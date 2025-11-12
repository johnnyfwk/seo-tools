export default function OpenGraph({ openGraph }) {
    if (!openGraph) return <p>No Open Graph data.</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Content</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(openGraph).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{value || "-"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
