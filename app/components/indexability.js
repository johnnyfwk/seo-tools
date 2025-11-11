export default function Indexability({
    statusCode,
    isAllowedByRobotsTxt,
    metaRobotsTagAllowsIndexing,
    canonicalTagIsSelfReferential
}) {
    // Determine indexability
    let status = true;
    let reasons = [];

    // Check HTTP status code
    if (statusCode !== 200) {
        status = false;
        reasons.push(`HTTP status is ${statusCode}, not 200.`);
    }

    // Check robots.txt
    if (isAllowedByRobotsTxt === false) {
        status = false;
        reasons.push("Blocked by robots.txt.");
    }

    // Check meta robots
    if (metaRobotsTagAllowsIndexing === false) {
        status = false;
        reasons.push("Meta robots tag has noindex.");
    }

    // Check canonical
    if (canonicalTagIsSelfReferential === false) {
        status = false;
        reasons.push("Canonical URL points elsewhere.");
    }

    return (
        <div>
            <p>{status ? "URL is Indexable ✅" : "URL is Not Indexable ❌"}</p>

            {reasons.length > 0
                ? <ul>
                    {reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                    ))}
                </ul>
                : null
            }
        </div>
    );
}