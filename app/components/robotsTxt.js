import Link from "next/link";

export default function RobotsTxt({ robotsTxt }) {
    if (!robotsTxt.exists) {
        return <p>No robots.txt found. Entered URL is allowed to be crawled by bots by default.</p>;
    }

    const { url, blocked, sitemaps } = robotsTxt;

    return (
        <div>
            <p>
                <strong>URL: </strong>
                {url
                    ? <Link href={url} target="_blank" rel="noopener noreferrer">{url}</Link>
                    : "N/A"
                }
            </p>

            <p>
                <strong>Allows crawling of entered URL?: </strong>
                {!blocked
                    ? "Yes ✅"
                    : "No 🚫"
                }
            </p>
            
            <p>
                <strong>Sitemaps:</strong>
            </p>
            {sitemaps.length > 0
                ? <ul>
                    {sitemaps.map((sitemap, i) => {
                        return (
                            <li key={i}>
                                <Link
                                    href={sitemap}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >{sitemap}</Link>
                            </li>
                        )
                    })}
                </ul>
                : <p>No sitemaps found.</p>
            }    
        </div>
    )
}