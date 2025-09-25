'use client';
import { useState } from "react";
import * as utils from '@/app/utils/utils';

export default function ClientOnPageChecker() {
    const [url, setUrl] = useState("");

    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [error, setError] = useState(null);

    const [metaTitles, setMetaTitles] = useState(null);
    const [metaDescription, setMetaDescription] = useState(null);
    const [h1s, setH1s] = useState(null);
    const [h2s, setH2s] = useState(null);
    const [h3s, setH3s] = useState(null);
    const [h4s, setH4s] = useState(null);
    const [h5s, setH5s] = useState(null);
    const [h6s, setH6s] = useState(null);

    async function handleCheckPage() {
        setError(null);
        setMetaTitles(null);
        setMetaDescription(null);
        setH1s(null);
        setH2s(null);
        setH3s(null);
        setH4s(null);
        setH5s(null);
        setH6s(null);

        let input = url.trim();

        if (!input.startsWith("http://") && !input.startsWith("https://")) {
            input = "https://" + input;
        }

        // Validate URL
        let validatedUrl;
        try {
            validatedUrl = new URL(input);
        } catch (err) {
            setError("Please enter a valid URL (must start with http:// or https://).");
            return;
        }

        setIsCheckingPage(true);

        try {
            const res = await fetch('/api/on-page-checker', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: validatedUrl.href }),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setMetaTitles(data.metaTitles);
                setMetaDescription(data.metaDescription);
                setH1s(data.h1s);
                setH2s(data.h2s);
                setH3s(data.h3s);
                setH4s(data.h4s);
                setH5s(data.h5s);
                setH6s(data.h6s);
            }

            setIsCheckingPage(false);
        } catch (err) {
            setError("Something went wrong.");
            setIsCheckingPage(false);
        }
    }

    return (
        <>
            <section>
                <h1>On-Page Checker</h1>

                <p>This is the introductory paragraph for the On-Page Checker page.</p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCheckPage();
                    }}
                >
                    <label htmlFor="url">Enter the full URL to check:</label>

                    <br />

                    <input
                        type="url"
                        name="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        required
                        disabled={isCheckingPage}
                        style={{width: '100%'}}
                    />

                    <br />

                    <input
                        type="submit"
                        value={isCheckingPage ? "Fetching data..." : "Check Page"}
                        disabled={!url || isCheckingPage}
                    />
                </form>

                {error
                    ? <p className="error">{error}</p>
                    : null
                }
            </section>

            {metaTitles === null
                ? null
                : <section>
                    <h2>Meta Title</h2>
                    {metaTitles.length === 0
                        ? <p className="error">No &lt;title&gt; tag found.</p>
                        : <>
                            {metaTitles.length > 1
                                ? <p className="warning">Multiple &lt;title&gt; tags found.</p>
                                : null
                            }
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metaTitles.map((metaTitle, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaTitle)}</td>
                                                <td style={{ textAlign: 'center' }} className={metaTitle.length > 60 ? 'error' : null}>{metaTitle.length}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    }
                </section>
            }

            {metaDescription === null
                ? null
                : <section>
                    <h2>Meta Description</h2>
                    {metaDescription
                        ? <table>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaDescription)}</td>
                                        <td style={{ textAlign: 'center' }} className={metaDescription.length > 160 ? 'error' : null}>{metaDescription.length}</td>
                                    </tr>
                                </tbody>
                            </table>
                        : <p className="error">The meta description tag does not exist or is empty.</p>
                    }
                </section>
            }

            {h1s === null
                ? null
                : <section>
                    <h2>H1 Tags</h2>
                    {h1s.length === 0
                        ? <p className="error">No &lt;h1&gt; tag found.</p>
                        : <>
                            {h1s.length > 1
                                ? <p className="warning">Multiple &lt;H1&gt; tags found.</p>
                                : null
                            }
                            <ul>
                                {h1s.map((h1, i) => <li key={i}>{h1}</li>)}
                            </ul>
                        </>
                    }
                </section>
            }

            {h2s === null
                ? null
                : <section>
                    <h2>H2 Tags</h2>
                    {h2s.length === 0
                        ? <p>No &lt;H2&gt; tags found.</p>
                        : <ul>
                            {h2s.map((h2, i) => <li key={i}>{h2}</li>)}
                        </ul>
                    }
                </section>
            }

            {h3s === null
                ? null
                : <section>
                    <h2>H3 Tags</h2>
                    {h3s.length === 0
                        ? <p>No &lt;H3&gt; tags found.</p>
                        : <ul>
                            {h3s.map((h3, i) => <li key={i}>{h3}</li>)}
                        </ul>
                    }
                </section>
            }

            {h4s === null
                ? null
                : <section>
                    <h2>H4 Tags</h2>
                    {h4s.length === 0
                        ? <p>No &lt;H4&gt; tags found.</p>
                        : <ul>
                            {h4s.map((h4, i) => <li key={i}>{h4}</li>)}
                        </ul>
                    }
                </section>
            }

            {h5s === null
                ? null
                : <section>
                    <h2>H5 Tags</h2>
                    {h5s.length === 0
                        ? <p>No &lt;H5&gt; tags found.</p>
                        : <ul>
                            {h5s.map((h5, i) => <li key={i}>{h5}</li>)}
                        </ul>
                    }
                </section>
            }

            {h6s === null
                ? null
                : <section>
                    <h2>H6 Tags</h2>
                    {h6s.length === 0
                        ? <p>No &lt;H6&gt; tags found.</p>
                        : <ul>
                            {h6s.map((h6, i) => <li key={i}>{h6}</li>)}
                        </ul>
                    }
                </section>
            }
        </>
    )
}