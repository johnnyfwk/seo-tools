export default function MetaRobotsAndXRobotsTag({ metaRobotsAndXRobotsTag }) {
    if (!metaRobotsAndXRobotsTag || !metaRobotsAndXRobotsTag.allDirectives) {
        return <p>No meta robots or x-robots tag found. URL is indexable and links on the page are followable by default.</p>;
    }

    const allDirectivesLower = String(metaRobotsAndXRobotsTag.allDirectives || "").toLowerCase();

    return (
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

                <tr style={{ textAlign: "left" }}>
                    <th>Allows indexing?</th>
                    <td>
                        {allDirectivesLower.includes('noindex')
                            ? "❌ No ('noindex' found)"
                            : "✅ Yes"
                        }
                    </td>
                </tr>

                <tr style={{ textAlign: "left" }}>
                    <th>Allows crawling of linked pages and passing of link equity?</th>
                    <td>
                        {allDirectivesLower.includes('nofollow')
                            ? "❌ No ('nofollow' found)"
                            : "✅ Yes"
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}