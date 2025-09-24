'use client';
import { useState } from "react";

export default function ClientOnPageChecker() {
    const [url, setUrl] = useState("");

    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [error, setError] = useState(null);

    const [metaTitle, setMetaTitle] = useState(null);
    

    async function handleCheckPage() {
        setError(null);
        setMetaTitle(null);

        let input = url.trim();

        if (!input.startsWith("http://") && !input.startsWith("https://")) {
            input = "https://" + input;
        }

        // Validate URL
        let validatedUrl;
        try {
            validatedUrl = new URL(input);
            if (!validatedUrl.protocol.startsWith("http")) {
                throw new Error("URL must start with http:// or https://");
            }
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
                setMetaTitle(data.metaTitle);
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
                        pattern="https://.*"
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
            </section>

            {isCheckingPage
                ? <p>Fetching page data...</p>
                : null
            }

            {error
                ? <p className="error">{error}</p>
                : null
            }

            {metaTitle === null
                ? null
                : <section>
                    <h2>Meta Title</h2>
                    {metaTitle
                        ? <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: 'left' }}>{metaTitle}</td>
                                    <td style={{ textAlign: 'center' }} className={metaTitle.length <= 60 ? 'success' : 'error'}>{metaTitle.length}</td>
                                </tr>
                            </tbody>
                        </table>
                        : <p className="error">The page has no &lt;title&gt; tag or it is empty.</p>
                    }
                </section>
            }
        </>
    )
}