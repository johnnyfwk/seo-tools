import Link from "next/link";

export default function RobotsTxt({ robotsTxt }) {
    if (!robotsTxt) {
        return <p>No robots.txt data available.</p>;
    }

    const { url, allowed, reason, fetchError } = robotsTxt;

    if (reason === "No robots.txt found") {
        return <p>No robots.txt found. URL is allowed to be crawled by bots by default.</p>;
    }

    return (
        <div>
            <p>
                <strong>URL:</strong>{" "}
                {url ? <Link href={url} target="_blank" rel="noopener noreferrer">{url}</Link> : "N/A"}
            </p>
            <p>
                <strong>URL is allowed to be crawled by bots?:</strong>{" "}
                {allowed ? "✅ Yes" : "🚫 No"}
            </p>

            {fetchError
                ? <p><strong>Fetch error:</strong> {fetchError}</p>
                : null
            }
        </div>
    )
}