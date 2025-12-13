export default function RobotsTxt({ robotsTxt }) {
    if (!robotsTxt.exists) {
        return <p>No robots.txt found. URL can be crawled by bots by default.</p>;
    }

    const {
        url,
        blocked,
        sitemaps,
        determiningRule,
    } = robotsTxt;

    const issues = [];

    const non200SitemapUrls = sitemaps.filter((sitemap) => {
        return sitemap.statusCode !== 200;
    });

    if (blocked) {
        issues.push("URL is blocked by robots.txt");
    }

    if (non200SitemapUrls.length === 1) {
        issues.push(`1 XML sitemap URL returns a status code that is not 200`);
    } else if (non200SitemapUrls.length > 1) {
        issues.push(`${non200SitemapUrls.length} XML sitemap URLs return status codes that are not 200`);
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
                : <p>✅ No issues found.</p>
            }

            <table>
                <tbody>
                    <tr style={{ textAlign: "left"}}>
                        <th>URL</th>
                        <td>
                            {url
                                ? <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                                : "N/A"
                            }
                        </td>
                    </tr>

                    <tr style={{ textAlign: "left"}}>
                        <th>Allows crawling of URL/final URL?</th>
                        <td>
                            {!blocked
                                ? "✅ Yes"
                                : "❌ No"
                            }
                        </td>
                    </tr>

                    {determiningRule
                        ? <tr style={{ textAlign: "left"}}>
                            <th>{blocked ? "Disallow" : "Allow"} rule</th>
                            <td>{determiningRule.rule}</td>
                        </tr>
                        : null
                    }

                    <tr style={{ textAlign: "left"}}>
                        <th>Sitemaps found ({sitemaps.length})</th>
                        <td>
                            {sitemaps.length > 0
                                ? <div className="table-links">
                                    {sitemaps.map((sitemap, i) => {
                                        return (
                                            <div key={i}>
                                                <a
                                                    href={sitemap.url}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                >{sitemap.url}</a>
                                                {" "}
                                                ({sitemap.statusCode === 200 ? "✅" : "❌"} {sitemap.statusCode})
                                            </div>
                                        )
                                    })}
                                </div>
                                : <p>No sitemaps found.</p>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}