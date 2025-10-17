export default function MetaRobotsTag({ metaRobotsTag }) {
    return (
        <section id="meta-robots-tag">
            <h2>
                Meta Robots Tag allows indexing?{" "}
                <span
                    className={
                        metaRobotsTag.toLowerCase().includes("noindex")
                            ? "warning-text"
                            : "success-text"
                    }
                >
                    {metaRobotsTag.toLowerCase().includes("noindex") ? "No" : "Yes"}
                </span>
            </h2>
            <p>{metaRobotsTag}</p>
        </section>
    )
}