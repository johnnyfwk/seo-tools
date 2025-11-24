import Link from "next/link";
import * as utils from '@/app/lib/utils/utils'; 

export default function Hreflang({ hreflang }) {
    if (hreflang.length === 0) {
        return <p>No hreflang tags found.</p>
    }

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>Source</th>
                    <th style={{ textAlign: 'center' }}>Hreflang</th>
                    <th style={{ textAlign: 'left' }}>URL</th>
                    <th style={{ textAlign: 'center' }}>Status Code</th>
                    <th style={{ textAlign: 'left' }}>Final URL</th>
                    <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
                    <th style={{ textAlign: 'center' }}>URL is blocked by robots.txt?</th>
                    <th style={{ textAlign: 'center' }}>URL's meta robots tag allows indexing?</th>
                    <th style={{ textAlign: 'center' }}>URL matches its canonical URL?</th>
                    <th style={{ textAlign: 'center' }}>URL is indexable?</th>
                </tr>
            </thead>
            <tbody>
                {hreflang.map((hreflang, index) => {
                    const indexability = utils.evaluateIndexability({
                        statusCode: hreflang.finalUrlStatusCode,
                        blockedByRobots: hreflang.robotsTxt?.blocked,
                        canonicalMatches: hreflang.canonicalTags?.tags[0]?.resolvedCanonicalUrlMatchesOriginalUrl,
                        metaRobotsAllowsIndexing: hreflang.metaRobotsTag?.allowsIndexing,
                    });

                    return (
                        <tr key={index}>
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

                            <td style={{ textAlign: 'left' }}>
                                {hreflang.initialUrlStatusCode >= 200 && hreflang.initialUrlStatusCode < 300
                                    ? "-"
                                    : hreflang.finalUrl
                                        ? <a
                                            href={hreflang.finalUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            {hreflang.finalUrl}
                                        </a>
                                        : "N/A"
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
                                    hreflang.metaRobotsTag.allowsIndexing
                                ).class}
                            >
                                {utils.getMetaRobotsTagTextAndClass(
                                    hreflang.metaRobotsTag.allowsIndexing
                                ).text}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={utils.getCanonicalTextAndClass(
                                    hreflang.canonicalTags.tags[0].resolvedCanonicalUrlMatchesOriginalUrl
                                ).class}
                            >
                                {utils.getCanonicalTextAndClass(
                                    hreflang.canonicalTags.tags[0].resolvedCanonicalUrlMatchesOriginalUrl
                                ).text}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={indexability.indexable
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {indexability.indexable ? "Yes" : "No"}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}