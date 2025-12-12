import Link from "next/link";

export default function XmlSitemaps({ xmlSitemaps }) {
    if (!xmlSitemaps) {
        return <p>XML sitemap data could be fetched.</p>;
    }

    if (xmlSitemaps.hasSitemap === null) {
        return <p>N/A</p>;
    }

    if (xmlSitemaps.hasSitemap === false) {
        return <p>No XML sitemaps found.</p>;
    }

    const issues = [];

    const containing = xmlSitemaps.sitemapsContainingUrl || [];
    const checked = xmlSitemaps.sitemapsChecked || [];
    const non200UrlsinChecked = checked.filter((sitemap) => {
        return sitemap.statusCode !== 200;
    });

    if (non200UrlsinChecked.length === 1) {
        issues.push(`1 XML sitemap URL returns a status code that is not 200`);
    } else if (non200UrlsinChecked.length > 1) {
        issues.push(`${non200UrlsinChecked.length} XML sitemap URLs return status codes that are not 200`);
    }

    if (containing.length === 0) {
        issues.push("URL not found in any sitemap.")
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
                : null
            }

            <table>
                <tbody>
                    <tr style={{ textAlign: "left"}}>
                        <th>Robots.txt URL</th>
                        <td>
                            {xmlSitemaps.robotsTxtChecked
                                ? <Link href={xmlSitemaps.robotsTxtChecked} target="_blank" rel="noopener noreferrer">
                                    {xmlSitemaps.robotsTxtChecked}
                                </Link>
                                : <span>No robots.txt file found</span>
                            }
                        </td>
                    </tr>

                    <tr style={{ textAlign: "left"}}>
                        <th>Sitemaps containing URL/final URL ({containing.length})</th>
                        <td>
                            {!xmlSitemaps.hasSitemap
                                ? "No sitemaps found"
                                : containing.length > 0
                                    ? <div className="table-links">
                                        {containing.map((sitemap, i) => (
                                            <a
                                                key={i}
                                                href={sitemap.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {sitemap.url}
                                            </a>
                                        ))}
                                    </div>
                                    : <span>URL not found in any sitemap</span>
                            }
                        </td>
                    </tr>

                    <tr style={{ textAlign: "left"}}>
                        <th>Sitemaps checked</th>
                        <td>
                            {!xmlSitemaps.hasSitemap
                                ? "No sitemaps found"
                                : checked.length > 0
                                    ? <div className="table-links">
                                        {checked.map((sitemap, i) => (
                                            <div key={i}>
                                                <a
                                                    key={i}
                                                    href={sitemap.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {sitemap.url}
                                                </a>
                                                {" "}
                                                ({sitemap.statusCode === 200 ? "✅" : "❌"} {sitemap.statusCode})
                                            </div>
                                        ))}
                                    </div>
                                    : <span>Sitemaps could not be checked</span>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}