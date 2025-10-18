import Link from "next/link";
import * as utils from '@/app/lib/utils'; 

export default function Hreflang({ hreflang }) {
    return (
        <section id="hreflang">
            <h2>Hreflang ({hreflang?.length || 0})</h2>

            {!hreflang?.length
                ? <p>No hreflang found.</p>
                : <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Source</th>
                            <th style={{ textAlign: 'center' }}>Hreflang</th>
                            <th style={{ textAlign: 'left' }}>URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                            <th style={{ textAlign: 'center' }}>Allowed by Robots.txt?</th>
                            <th style={{ textAlign: 'center' }}>Is NoIndex?</th>
                            <th style={{ textAlign: 'center' }}>URL = Canonical URL?</th>
                            <th style={{ textAlign: 'center' }}>URL is Indexable?</th>
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
                                        <Link href={hreflang.url} target="_blank">{hreflang.url}</Link>
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
            }
        </section>
    )
}