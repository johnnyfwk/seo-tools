export default function MetaRobotsTag({ metaRobotsTag }) {
    if (!metaRobotsTag || !metaRobotsTag.content) {
        return <p>No meta robots tag found. URL is indexable and links are followable by default.</p>;
    }

    return (
        <>
            <p>
                <strong>HTML Tag Content: </strong>
                {metaRobotsTag.htmlTagContent
                    ? <code>{metaRobotsTag.htmlTagContent}</code>
                    : "N/A"
                }
                
            </p>

            <p>
                <strong>X-Robots-Tag Content: </strong>
                {metaRobotsTag.xRobotsTagContent
                    ? <code>{metaRobotsTag.xRobotsTagContent}</code>
                    : "N/A"
                }
            </p>

            <p>
                <strong>Allows indexing?: </strong>
                {metaRobotsTag.allowsIndexing
                    ? <span>✅ Yes</span>
                    : <span>❌ No</span>
                }
            </p>

            <p>
                <strong>Allows crawling of linked pages / passing of link equity?: </strong>
                {metaRobotsTag.allowsFollowing
                    ? <span>✅ Yes</span>
                    : <span>❌ No</span>
                }
            </p>
        </>
    )
}