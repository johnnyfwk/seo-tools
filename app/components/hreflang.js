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
                    <th style={{ textAlign: 'center' }}>Hreflang URL is allowed by Robots.txt?</th>
                    <th style={{ textAlign: 'center' }}>Hreflang URL has noindex tag?</th>
                    <th style={{ textAlign: 'center' }}>Canonical URL matches Hreflang URL?</th>
                    <th style={{ textAlign: 'center' }}>Hreflang URL is indexable?</th>
                </tr>
            </thead>
            <tbody>
                {hreflang.map((hreflang, index) => {
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
                                    href={hreflang.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{hreflang.url}</Link>
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={hreflang.hreflangUrlStatusCode === 200
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {hreflang.hreflangUrlStatusCode || "Fetch failed"}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {hreflang.hreflangUrlStatusCode !== 200
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
                                className={hreflang.hreflangUrlStatusCode === 200
                                    ? ""
                                    : hreflang.finalUrlStatusCode === 200                                    
                                        ? "success-background"
                                        : "error-background"
                                }
                            >
                                {hreflang.hreflangUrlStatusCode === 200
                                    ? "-"
                                    : hreflang.finalUrlStatusCode || "Fetch failed"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={hreflang.robotsTxt?.allowed
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {hreflang.robotsTxt?.allowed ? "Yes" : "No"}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={!hreflang.isNoindex
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {!hreflang.isNoindex ? "No" : "Yes"}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={hreflang.canonicalData.matchesFirstCanonicalTag
                                    ? "success-background"
                                    : "warning-background"
                                }
                            >
                                {hreflang.canonicalData.matchesFirstCanonicalTag 
                                    ? "Yes"
                                    : "No"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={hreflang.hreflangUrlIsIndexable
                                    ? "success-background"
                                    : "error-background"
                                }
                            >{hreflang.hreflangUrlIsIndexable ? "Yes" : "No"}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}