export default function RobotsTxt({ robotsTxt }) {
    if (!robotsTxt.exists) {
        return <p>No robots.txt found. Entered URL is allowed to be crawled by bots by default.</p>;
    }

    const {
        url,
        blocked,
        sitemaps,
        determiningRule,
    } = robotsTxt;

    return (
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
                    <th>Allows crawling of URL?</th>
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
                                            ({sitemap.ok ? "✅" : "❌"} {sitemap.statusCode})
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
    )
}