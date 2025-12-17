import Link from "next/link";
import * as utils from '@/app/lib/utils/utils'; 

export default function Hreflang({ hreflang, contentType, xRobotsNoindex }) {
    if (hreflang.length === 0) {
        return <p>No hreflang tags found.</p>
    }

    const issues = [];

    const nullStatusCodeLinks = hreflang.filter((h) => {
        return h.initialUrlStatusCode === null;
    });

    const non200links = hreflang.filter((h) => {
        return h.initialUrlStatusCode !== null && h.initialUrlStatusCode !== 200;
    });

    const linksBlockedByRobotsTxt = hreflang.filter((h) => {
        return h.robotsTxt.blocked === true;
    });

    const noindexLinks = hreflang.filter((h) => {
        return h.metaRobotsAndXRobotsTag?.allDirectives?.toLowerCase().includes("noindex");
    });

    const canonicalUrlDoesntMatch = hreflang.filter((h) => {
        return h.canonicalTags?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl === false;
    });

    if (nullStatusCodeLinks.length > 0) {
        if (nullStatusCodeLinks.length === 1) {
            issues.push("1 link status code could not be fetched");
        } else if (nullStatusCodeLinks.length > 1) {
            issues.push(`${nullStatusCodeLinks.length} link status codes could not be fetched`);
        }
    }

    if (non200links.length > 0) {
        if (non200links.length === 1) {
            issues.push(`1 link returns a non-200 status code`);
        } else {
            issues.push(`${non200links.length} links return a non-200 status code`);
        }
    }

    if (linksBlockedByRobotsTxt.length > 0) {
        if (linksBlockedByRobotsTxt.length === 1) {
            issues.push(`1 link is blocked by robots.txt`);
        } else {
            issues.push(`${linksBlockedByRobotsTxt.length} links are blocked by robots.txt`);
        }
    }
    
    if (noindexLinks.length > 0) {
        if (noindexLinks.length === 1) {
            issues.push(`1 link has a meta robots/x-robots tag with a 'noindex' value`);
        } else {
            issues.push(`${noindexLinks.length} links have meta robots/x-robots tags with 'noindex' values`);
        }
    }

    if (canonicalUrlDoesntMatch.length > 0) {
        if (canonicalUrlDoesntMatch.length === 1) {
            issues.push(`1 link doesn't have a matching canonical URL`);
        } else {
            issues.push(`${canonicalUrlDoesntMatch.length} links don't matching canonical URLs`);
        }
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
                            return <li key={i}>{issue}</li>
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }

            <div className="table-wrapper">
                <table style={{ width: "max-content" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th style={{ textAlign: 'center' }}>Source</th>
                            <th style={{ textAlign: 'center' }}>Hreflang</th>
                            <th style={{ textAlign: 'left' }}>URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                            <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
                            <th style={{ textAlign: 'center' }}>Blocked by robots.txt?</th>
                            <th style={{ textAlign: 'center' }}>Meta robots/X-robots tag allows indexing?</th>
                            <th style={{ textAlign: 'center' }}>Canonical URL matches hreflang URL?</th>
                            <th style={{ textAlign: 'center' }}>Indexable?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hreflang.map((hreflang, index) => {
                            const indexability = utils.evaluateIndexability({
                                statusCode: hreflang.finalUrlStatusCode,
                                blockedByRobots: hreflang.robotsTxt?.blocked,
                                canonicalMatches: hreflang.canonicalTags?.tags[0]?.resolvedCanonicalUrlMatchesOriginalUrl,
                                metaRobotsAllowsIndexing: !hreflang.metaRobotsAndXRobotsTag?.allDirectives?.includes("noindex"),
                                contentType,
                                xRobotsNoindex,
                            });

                            return (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>
                                        {index + 1}
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        {hreflang.source}
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        {hreflang.hreflang}
                                    </td>

                                    <td style={{ textAlign: 'left' }}>
                                        {hreflang.initialUrl
                                            ? <a
                                                href={hreflang.initialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="component-links"
                                            >
                                                {hreflang.initialUrl}
                                            </a>
                                            : "N/A"
                                        }
                                        
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={utils.getInitialUrlStatusCodeClass(hreflang.initialUrlStatusCode)}
                                    >
                                        {hreflang.initialUrlStatusCode || "N/A"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {hreflang.initialUrlStatusCode >= 300 && hreflang.initialUrlStatusCode < 400
                                            ? hreflang.finalUrl
                                                ? <a
                                                    href={hreflang.finalUrl}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="component-links"
                                                >
                                                    {hreflang.finalUrl}
                                                </a>
                                                : "N/A"
                                            : "-"
                                        }
                                    </td>

                                    <td
                                        style={{ textAlign: "center" }}
                                        className={utils.getFinalUrlStatusCodeTextAndClass(
                                            hreflang.initialUrlStatusCode,
                                            hreflang.finalUrlStatusCode
                                        ).class}
                                    >
                                        {utils.getFinalUrlStatusCodeTextAndClass(
                                            hreflang.initialUrlStatusCode,
                                            hreflang.finalUrlStatusCode
                                        ).text}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={utils.getRobotsTxtTextAndClass(
                                            hreflang.robotsTxt.blocked
                                        ).class}
                                    >
                                        {utils.getRobotsTxtTextAndClass(
                                            hreflang.robotsTxt.blocked
                                        ).text}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={hreflang.metaRobotsAndXRobotsTag === null
                                            ? ""
                                            : utils.getMetaRobotsTagTextAndClass(
                                                !hreflang.metaRobotsAndXRobotsTag?.allDirectives?.toLowerCase().includes("noindex")
                                            ).class || ""    
                                        }
                                    >
                                        {hreflang.metaRobotsAndXRobotsTag === null
                                            ? "N/A"
                                            : utils.getMetaRobotsTagTextAndClass(
                                                !hreflang.metaRobotsAndXRobotsTag?.allDirectives?.toLowerCase().includes("noindex")
                                            ).text || "N/A"
                                        }
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={utils.getCanonicalTextAndClass(
                                            hreflang.canonicalTags?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl
                                        ).class || ""}
                                    >
                                        {utils.getCanonicalTextAndClass(
                                            hreflang.canonicalTags?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl
                                        ).text || "N/A"}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={indexability.indexable === true
                                            ? "success-background"
                                            : indexability.indexable === false
                                                ? "error-background"
                                                : ""
                                        }
                                    >
                                        {indexability.indexable === true
                                            ? "Yes"
                                            : indexability.indexable === false
                                                ? "No"
                                                : "N/A"
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}