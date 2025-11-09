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
                    <th style={{ textAlign: 'center' }}>Hreflang URL Status Code</th>
                    <th style={{ textAlign: 'left' }}>Final URL</th>
                    <th style={{ textAlign: 'center' }}>Hreflang URL is allowed by Robots.txt?</th>
                    <th style={{ textAlign: 'center' }}>Hreflang URL has noindex tag?</th>
                    <th style={{ textAlign: 'center' }}>Hreflang URL has self-referencing canonical URL?</th>
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
                                className={hreflang.statusCode === 200
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {hreflang.statusCode || "Fetch failed"}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                <Link href={hreflang.finalUrl} target="_blank">{hreflang.finalUrl}</Link>
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={hreflang.robotsTxtCheck?.allowed
                                    ? "success-background"
                                    : "error-background"
                                }
                            >
                                {hreflang.robotsTxtCheck?.allowed ? "Yes" : "No"}
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
                                className={utils.normaliseUrl(hreflang.url) === utils.normaliseUrl(hreflang.canonicalUrl)
                                    ? "success-background"
                                    : "warning-background"
                                }
                            >
                                {utils.normaliseUrl(hreflang.url) === utils.normaliseUrl(hreflang.canonicalUrl) ? "Yes" : "No"}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={hreflang.isIndexable
                                    ? "success-background"
                                    : "error-background"
                                }
                            >{hreflang.isIndexable ? "Yes" : "No"}</td>
                            
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}