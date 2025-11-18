export default function MetaRobotsTag({ metaRobotsTag }) {
    if (!metaRobotsTag || !metaRobotsTag.content) {
        return <p>ℹ️ No meta robots tag found. URL is indexable and links are followable by default.</p>;
    }

    return (
        <div>
            <p><strong>Content:</strong> <code>{metaRobotsTag.content}</code></p>

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
        </div>
    )
}