'use client';
import { useState } from "react";

export default function ClientOnPageChecker() {
    const [url, setUrl] = useState("");

    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [error, setError] = useState(null);

    const [metaTitles, setMetaTitles] = useState(null);
    const [h1s, setH1s] = useState(null);

    async function handleCheckPage() {
        setError(null);
        setMetaTitles(null);
        setH1s(null);

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
                setH1s(data.h1s);
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
                        value="Check Page"
                        disabled={!url || isCheckingPage}
                    />
                </form>

                {isCheckingPage
                    ? <p>Fetching page data...</p>
                    : null
                }

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
                                                <td style={{ textAlign: 'left' }}>{metaTitle}</td>
                                                <td style={{ textAlign: 'center' }} className={metaTitle.length <= 60 ? 'success' : 'error'}>{metaTitle.length}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    }
                </section>
            }

            {h1s === null
                ? null
                : <section>
                    <h2>H1 Tag</h2>
                    {h1s.length === 0
                        ? <p className="error">No &lt;h1&gt; tag found.</p>
                        : h1s.length === 1
                            ? <p>{h1s[0]}</p>
                            : <>
                                <p className="warning">Multiple &lt;h1&gt; tags found.</p>
                                <ul>
                                    {h1s.map((h1, i) => <li key={i}>{h1}</li>)}
                                </ul>
                            </>
                    }
                </section>
            }
        </>
    )
}