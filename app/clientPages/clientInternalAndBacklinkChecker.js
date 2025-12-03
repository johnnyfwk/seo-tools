'use client';

import { useState } from "react";
import Link from "next/link";
import RobotsDisclaimer from "../components/robotsDisclaimer";
import * as utils from '@/app/lib/utils/utils';

export default function ClientInternalAndBacklinkChecker({ metaDescription }) {
    const [sourceUrls, setSourceUrls] = useState("");
    const [targetUrl, setTargetUrl] = useState("");
    const [links, setLinks] = useState([]);
    const [scrapeDuration, setScrapeDuration] = useState("");
    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [hasCheckedPage, setHasCheckedPage] = useState(false);
    const [scrapeEvenIfBlocked, setScrapeEvenIfBlocked] = useState(false);
    const [error, setError] = useState("");

    async function handleCheck(e) {
        e.preventDefault();

        setHasCheckedPage(false);
        setIsCheckingPage(true);
        setScrapeDuration("");
        setError("");
        setLinks([]);

        const {
            valid,
            url,
            error: validationError
        } = utils.validateUrlFrontend(targetUrl);

        if (!valid) {
            setError(validationError);
            return;
        }

        const sources = sourceUrls
            .split('\n')
            .map(url => url.trim())
            .filter(Boolean);

        const startScrapingTime = performance.now();

        try {
            const res = await fetch('/api/internal-and-backlink-checker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl: url,
                    sourceUrls: sources
                }),
            });

            const data = await res.json();
            console.log("Data:", data);

            const endScrapingTime = performance.now();
            const elapsedMs = endScrapingTime - startScrapingTime;
            setScrapeDuration(utils.formatScrapeDuration(elapsedMs))
            

            if (data.error) {
                setError(data.error)
            } else {
                setLinks(data);
            };

            setHasCheckedPage(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsCheckingPage(false);
        }
    }

    return (
        <>
            <section>
                <h1>Free Internal & Backlink Checker</h1>

                <p>{metaDescription}</p>

                <form onSubmit={handleCheck}>
                    <label htmlFor="sourceUrls">Enter source URLs (one per line):</label>

                    <textarea
                        id="sourceUrls"
                        value={sourceUrls}
                        onChange={e => setSourceUrls(e.target.value)}
                        rows={10}
                        style={{width: '100%'}}
                    />

                    <label htmlFor="url">Enter target URL:</label>

                    {error
                        ? <p className="error-text">{error}</p>
                        : null
                    }

                    <input
                        id="url"
                        type="url"
                        value={targetUrl}
                        onChange={e => setTargetUrl(e.target.value)}
                        style={{width: '100%'}}
                    />

                    <RobotsDisclaimer
                        checked={scrapeEvenIfBlocked}
                        onChange={(value) => {
                            setScrapeEvenIfBlocked(value);
                            setHasCheckedPage(false); // reset until next fetch
                        }}
                    />

                    <button
                        type="submit"
                        disabled={!sourceUrls ||
                            !targetUrl ||
                            isCheckingPage
                        }
                    >{isCheckingPage ? 'Checking...' : 'Check Links'}</button>
                </form>      
            </section>

            {hasCheckedPage === true
                ? <>
                    <section>
                        <h2>Scrape Duration</h2>
                        <p>{scrapeDuration}</p>
                    </section>
                    
                    <section>
                        <h2>Links</h2>

                        <p>Links will be displayed here.</p>

                        {/* <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Source URL</th>
                                    <th style={{ textAlign: 'center' }}>Links to Target URL?</th>
                                    <th>Anchor Text(s)</th>
                                    <th>Dofollow?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {links.map((result, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            <Link href={result.sourceUrl} target="_blank">{result.sourceUrl}</Link>
                                        </td>
                                        <td style={{ textAlign: 'left' }}>{result.error ? result.error : result.hasLink ? '✅ Yes' : '❌ No'}</td>
                                        <td>
                                            <ul>
                                                {result.links?.map((link, j) => (
                                                    <li key={j}>{link.anchor || "(no anchor text)"}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>
                                            {result.links?.map((link, j) => (
                                                <div key={j}>{link.dofollow ? "✅ Dofollow" : "🚫 Nofollow"}</div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                    </section>
                </>
                : null
            }
        </>
    )
}