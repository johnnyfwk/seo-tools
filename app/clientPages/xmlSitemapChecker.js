'use client';

import { useState } from "react";
import Link from "next/link";

export default function ClientXmlSitemapChecker() {
    const [xmlSitemapUrl, setXmlSitemapUrl] = useState("");
    const [isCheckingXmlSitemap, setIsCheckingXmlSitemap] = useState(false);
    const [error, setError] = useState("");
    const [xmlSitemapUrls, setXmlSitemapUrls] = useState([]);
    const [hasChecked, setHasChecked] = useState(false);

    async function handleCheckXmlSitemap() {
        setError("");
        setXmlSitemapUrls([]);
        setIsCheckingXmlSitemap(true);
        setHasChecked(false);

        let xmlSitemap = xmlSitemapUrl.trim();
        
        try {
            const response = await fetch('/api/xml-sitemap-checker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ xmlSitemap })
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setXmlSitemapUrls(data.urls);
            }
        } catch {
            setError("Something went wrong.");
        } finally {
            setIsCheckingXmlSitemap(false);
            setHasChecked(true);
        }
    }

    return (
        <>
            <section>
                <h1>XML Sitemap Checker</h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCheckXmlSitemap();
                    }}
                >
                    <label htmlFor="xml-sitemap-url">Enter the XML Sitemap URL:</label>

                    <input
                        type="url"
                        name="xml-sitemap-url"
                        id="xml-sitemap-url"
                        value={xmlSitemapUrl}
                        onChange={(e) => setXmlSitemapUrl(e.target.value)}
                        placeholder="https://example.com/sitemap.xml"
                        required
                        disabled={isCheckingXmlSitemap}
                        style={{width: '100%', padding: "10px"}}
                    />

                    <input
                        type="submit"
                        value={isCheckingXmlSitemap ? "Fetching data..." : "Check XML Sitemap"}
                        disabled={!xmlSitemapUrl.trim() || isCheckingXmlSitemap}
                    />
                </form>
            </section>

            {hasChecked && error
                ? <p className="error-text">{error}</p>
                : null
            }

            {hasChecked && !error
                ? <section>
                    <h2>URLs ({xmlSitemapUrls.length})</h2>
                    
                    {xmlSitemapUrls.length > 0 && !error
                        ? <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {xmlSitemapUrls.map((url, i) => {
                                    return (
                                        <tr key={`${i}-${url}`}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                <Link href={url} target="_blank">
                                                    {url}
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        : <p>No URLs found in the XML sitemap</p>
                    }
                </section>
                : null
            }
        </>
    )
}