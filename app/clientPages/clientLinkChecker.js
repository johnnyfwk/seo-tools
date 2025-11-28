'use client';

import { useState } from "react";
import Link from "next/link";

export default function ClientLinkChecker({ metaDescription }) {
    const [destinationUrl, setDestinationUrl] = useState('');
    const [enteredDestinationUrl, setEnteredDestinationUrl] = useState(null);
    const [sourceUrls, setSourceUrls] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleCheck(e) {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setEnteredDestinationUrl(null);
        setResults(null);

        const sources = sourceUrls.split('\n').map(url => url.trim()).filter(Boolean);

        try {
            const res = await fetch('/api/link-checker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinationUrl, sourceUrls: sources }),
            });

            const data = await res.json();

            if (data.error) setError(data.error);
            else {
                setResults(data);
                setEnteredDestinationUrl(destinationUrl);
            };
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section>
                <h1>Backlink & Internal Link Checker</h1>

                <p>{metaDescription}</p>

                <form onSubmit={handleCheck}>
                    <label htmlFor="url">Enter destination URL:</label>

                    <br />

                    <input
                        type="url"
                        value={destinationUrl}
                        onChange={e => setDestinationUrl(e.target.value)}
                        style={{width: '100%'}}
                        required
                    />

                    <br />

                    <label htmlFor="url">Enter source URLs (one per line):</label>

                    <br />

                    <textarea
                        value={sourceUrls}
                        onChange={e => setSourceUrls(e.target.value)} rows={5}
                        style={{width: '100%'}}
                    />

                    <br />

                    <button
                        type="submit"
                        disabled={loading}
                    >{loading ? 'Checking...' : 'Check Backlinks'}</button>
                </form>      
            </section>

            <section>
                {error
                    ? <p className="error-text">{error}</p>
                    : null
                }

                {enteredDestinationUrl === null
                    ? null
                    : <section>
                        <h2>Destination URL</h2>
                        <p>
                            <Link href={enteredDestinationUrl} target="_blank">{enteredDestinationUrl}</Link>
                        </p>
                    </section>
                }

                {results === null
                    ? null
                    : <section>
                        <h2>Links</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Source URL</th>
                                    <th style={{ textAlign: 'center' }}>Links to Destination URL?</th>
                                    <th>Anchor Text(s)</th>
                                    <th>Dofollow?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.results.map((result, i) => (
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
                        </table>
                    </section>
                }
            </section>
        </>
    )
}