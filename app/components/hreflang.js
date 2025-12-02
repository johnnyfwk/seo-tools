import Link from "next/link";
import * as utils from '@/app/lib/utils/utils'; 

export default function Hreflang({ hreflang, contentType, xRobotsNoindex }) {
    if (hreflang.length === 0) {
        return <p>No hreflang tags found.</p>
    }

    return (
        <table>
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
                    <th style={{ textAlign: 'center' }}>Meta robots tag allows indexing?</th>
                    <th style={{ textAlign: 'center' }}>Canonical URL matches URL?</th>
                    <th style={{ textAlign: 'center' }}>Indexable?</th>
                </tr>
            </thead>
            <tbody>
                {hreflang.map((hreflang, index) => {
                    const indexability = utils.evaluateIndexability({
                        statusCode: hreflang.finalUrlStatusCode,
                        blockedByRobots: hreflang.robotsTxt?.blocked,
                        canonicalMatches: hreflang.canonicalTags?.tags[0]?.resolvedCanonicalUrlMatchesOriginalUrl,
                        metaRobotsAllowsIndexing: hreflang.metaRobotsTag?.allowsIndexing,
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
                                    ? <Link
                                        href={hreflang.initialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {hreflang.initialUrl}
                                    </Link>
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
                                        >
                                            {hreflang.finalUrl}
                                        </a>
                                        : "N/A"
                                    : "-"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={utils.getFinalUrlStatusCodeTextAndClass(
                                    hreflang.initialUrlStatusCode,
                                    hreflang.finalUrlStatusCode
                                ).class}
                            >
                                {hreflang.initialUrlStatusCode >= 200 && hreflang.initialUrlStatusCode < 300
                                    ? "-"
                                    : hreflang.finalUrlStatusCode || "N/A"
                                }
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
                                className={utils.getMetaRobotsTagTextAndClass(
                                    hreflang.metaRobotsTag?.allowsIndexing
                                ).class || ""}
                            >
                                {utils.getMetaRobotsTagTextAndClass(
                                    hreflang.metaRobotsTag?.allowsIndexing
                                ).text || "N/A"}
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
    )
}