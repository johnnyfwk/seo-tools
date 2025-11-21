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
                    <th style={{ textAlign: 'center' }}>Allowed by Robots.txt?</th>
                    <th style={{ textAlign: 'center' }}>Meta robots tag allows indexing?</th>
                    <th style={{ textAlign: 'center' }}>Canonical URL matches Hreflang URL?</th>
                    <th style={{ textAlign: 'center' }}>URL is indexable?</th>
                </tr>
            </thead>
            <tbody>
                {hreflang.map((hreflang, index) => {
                    let initialUrlStatusCodeClass;
                    if (hreflang.initialUrlStatusCode >= 200 && hreflang.initialUrlStatusCode < 300) {
                        initialUrlStatusCodeClass = "success-background";
                    } else if (hreflang.initialUrlStatusCode === null) {
                        initialUrlStatusCodeClass = "";
                    } else {
                        initialUrlStatusCodeClass = "error-background";
                    }

                    let finalUrlStatusCodeClass;
                    if (hreflang.initialUrlStatusCode >= 200 && hreflang.initialUrlStatusCode < 300) {
                        finalUrlStatusCodeClass = "";
                    } else if (hreflang.finalUrlStatusCode >= 200 && hreflang.finalUrlStatusCode < 300) {
                        finalUrlStatusCodeClass = "success-background";
                    } else if (hreflang.finalUrlStatusCode === null) {
                        finalUrlStatusCodeClass = "";
                    } else {
                        finalUrlStatusCodeClass = "error-background";
                    }

                    let robotsTextAndClass;
                    if (hreflang.robotsTxtData?.blocked === false) {
                        robotsTextAndClass = {
                            text: "Yes",
                            class: "success-background"
                        }
                    } else if (hreflang.robotsTxtData?.blocked === false) {
                        robotsTextAndClass = {
                            text: "No",
                            class: "warning-background"
                        }
                    } else {
                        robotsTextAndClass = {
                            text: "N/A",
                            class: ""
                        }
                    }

                    let metaRobotsTagTextAndClass;
                    if (hreflang.metaRobotsData?.allowsIndexing === true) {
                        metaRobotsTagTextAndClass = {
                            text: "Yes",
                            class: "success-background"
                        }
                    } else if (hreflang.metaRobotsData?.allowsIndexing === false) {
                        metaRobotsTagTextAndClass = {
                            text: "No",
                            class: "warning-background"
                        }
                    } else {
                        metaRobotsTagTextAndClass = {
                            text: "N/A",
                            class: ""
                        }
                    }

                    let canonicalTextAndClass;
                    if (hreflang.canonicalData?.tags[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true) {
                        canonicalTextAndClass = {
                            text: "Yes",
                            class: "success-background"
                        }
                    } else if (hreflang.canonicalData?.tags[0]?.resolvedCanonicalUrlMatchesOriginalUrl === false) {
                        canonicalTextAndClass = {
                            text: "No",
                            class: "warning-background"
                        }
                    } else {
                        canonicalTextAndClass = {
                            text: "Unknown",
                            class: ""
                        }
                    }

                    const indexability = utils.evaluateIndexability({
                        statusCode: hreflang.initialUrlStatusCode,
                        blockedByRobots: hreflang.robotsTxtData?.blocked,
                        canonicalMatches: hreflang.metaRobotsData?.allowsIndexing,
                        metaRobotsAllowsIndexing: hreflang.canonicalData?.tags[0]?.resolvedCanonicalUrlMatchesOriginalUrl === true,
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
                                <Link
                                    href={hreflang.initialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{hreflang.initialUrl}</Link>
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={initialUrlStatusCodeClass}
                            >
                                {hreflang.initialUrlStatusCode || "N/A"}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {hreflang.initialUrlStatusCode < 200 || hreflang.initialUrlStatusCode >= 300
                                    ? <Link
                                        href={hreflang.finalUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >{hreflang.finalUrl}</Link>
                                    : "-"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={finalUrlStatusCodeClass}
                            >
                                {hreflang.initialUrlStatusCode === 200
                                    ? "-"
                                    : hreflang.finalUrlStatusCode || "N/A"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={robotsTextAndClass.class}
                            >
                                {robotsTextAndClass.text}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={metaRobotsTagTextAndClass.class}
                            >
                                {metaRobotsTagTextAndClass.text}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={canonicalTextAndClass.class}
                            >
                                {canonicalTextAndClass.text}
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