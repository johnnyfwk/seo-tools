export default function MetaRobotsAndXRobotsTag({ metaRobotsAndXRobotsTag }) {
    if (!metaRobotsAndXRobotsTag || !metaRobotsAndXRobotsTag.allDirectives) {
        return <p>⚠️ No meta robots or x-robots tag found. URL is indexable and links on the page are followable by default.</p>;
    }

    const allDirectivesLower = String(metaRobotsAndXRobotsTag.allDirectives || "").toLowerCase();

    const issues = [];

    if (allDirectivesLower.includes('noindex')) {
        issues.push("Indexing not allowed");
    }

    if (allDirectivesLower.includes('nofollow')) {
        issues.push("Crawling of linked pages and passing of link equity not allowed");
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Potential issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return (
                                <li key={i}>{issue}</li>
                            )
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found</p>
            }

            <table>
                <tbody>
                    <tr style={{ textAlign: "left" }}>
                        <th>Meta Robots Tag Content</th>
                        <td>{metaRobotsAndXRobotsTag.metaRobotsTagContent || "N/A"}</td>
                    </tr>

                    <tr style={{ textAlign: "left" }}>
                        <th>X-Robots Tag Content</th>
                        <td>{metaRobotsAndXRobotsTag.xRobotsTagContent || "N/A"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}