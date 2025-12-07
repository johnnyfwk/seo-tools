export default function MetaRobotsAndXRobotsTag({ metaRobotsAndXRobotsTag }) {
    if (!metaRobotsAndXRobotsTag || !metaRobotsAndXRobotsTag.allDirectives) {
        return <p>No meta robots or x-robots tag found. URL is indexable and links on the page are followable by default.</p>;
    }

    const allDirectivesLower = String(metaRobotsAndXRobotsTag.allDirectives || "").toLowerCase();

    return (
        <>
            <p>
                <strong>HTML Tag Content: </strong>
                {metaRobotsAndXRobotsTag.metaRobotsTagContent
                    ? <code>{metaRobotsAndXRobotsTag.metaRobotsTagContent}</code>
                    : "N/A"
                }
                
            </p>

            <p>
                <strong>X-Robots-Tag Content: </strong>
                {metaRobotsAndXRobotsTag.xRobotsTagContent
                    ? <code>{metaRobotsAndXRobotsTag.xRobotsTagContent}</code>
                    : "N/A"
                }
            </p>

            <p>
                <strong>Allows indexing?: </strong>
                {allDirectivesLower.includes('noindex')
                    ? "❌ No ('noindex' found)"
                    : "✅ Yes"
                }
            </p>

            <p>
                <strong>Allows crawling of linked pages and passing of link equity?: </strong>
                {allDirectivesLower.includes('nofollow')
                    ? "❌ No ('nofollow' found)"
                    : "✅ Yes"
                }
            </p>
        </>
    )
}