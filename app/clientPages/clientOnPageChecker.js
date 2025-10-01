'use client';
import { useState } from "react";
import Link from "next/link";
import * as utils from '@/app/lib/utils';

export default function ClientOnPageChecker() {
    const [inputUrl, setInputUrl] = useState("");
    const [analysedUrl, setAnalysedUrl] = useState("");

    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [error, setError] = useState(null);

    const [isUrlIndexable, setIsUrlIndexable] = useState(null);
    const [indexabilityMessage, setIndexabilityMessage] = useState(null);
    const [enteredUrlStatusCode, setEnteredUrlStatusCode] = useState(null);
    const [finalUrl, setFinalUrl] = useState(null);
    const [redirectChain, setRedirectChain] = useState(null);
    const [robotsTxt, setRobotsTxt] = useState(null);
    const [metaRobotsTag, setMetaRobotsTag] = useState(null);
    const [canonicalUrl, setCanonicalUrl] = useState(null);
    const [metaTitles, setMetaTitles] = useState(null);
    const [metaDescriptions, setMetaDescriptions] = useState(null);
    const [h1s, setH1s] = useState(null);
    const [h2s, setH2s] = useState(null);
    const [h3s, setH3s] = useState(null);
    const [h4s, setH4s] = useState(null);
    const [h5s, setH5s] = useState(null);
    const [h6s, setH6s] = useState(null);
    const [pageLinks, setPageLinks] = useState(null);
    const [images, setImages] = useState(null);

    async function handleCheckPage() {
        setError(null);
        setIsUrlIndexable(null);
        setIndexabilityMessage(null);
        setEnteredUrlStatusCode(null);
        setFinalUrl(null);
        setRedirectChain(null);
        setRobotsTxt(null);
        setMetaRobotsTag(null);
        setCanonicalUrl(null);
        setMetaTitles(null);
        setMetaDescriptions(null);
        setH1s(null);
        setH2s(null);
        setH3s(null);
        setH4s(null);
        setH5s(null);
        setH6s(null);
        setPageLinks(null);
        setImages(null);

        let input = inputUrl.trim();

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
        setAnalysedUrl(validatedUrl.href);

        try {
            const res = await fetch('/api/on-page-checker', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: validatedUrl.href }),
            });

            const data = await res.json();
            console.log(data);

            setEnteredUrlStatusCode(data.enteredUrlStatusCode);
            setRobotsTxt(data.robotsCheck);

            if (data.error) {
                setError(data.error);
            } else if (data.enteredUrlStatusCode === 200) {
                setMetaRobotsTag(data.metaRobotsTag);
                setCanonicalUrl(data.canonicalUrl);
                setMetaTitles(data.metaTitles);
                setMetaDescriptions(data.metaDescriptions);
                setH1s(data.h1s);
                setH2s(data.h2s);
                setH3s(data.h3s);
                setH4s(data.h4s);
                setH5s(data.h5s);
                setH6s(data.h6s);
                setPageLinks(data.pageLinks);
                setImages(data.images);
            } else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setFinalUrl(data.finalUrl);
                setRedirectChain(data.redirectChain);
            } else if (data.enteredUrlStatusCode >= 400 && data.enteredUrlStatusCode < 600) {
                setFinalUrl(data.finalUrl);
            } else {
                // Unexpected status code (outside 200–599 range)
                console.warn("Unhandled status code:", data.enteredUrlStatusCode);
                setFinalUrl(data.finalUrl);
            }

            if (data.metaRobotsTag?.includes("noindex")) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("The meta robots tag is set to 'noindex'.");
            } else if (data.enteredUrlStatusCode === 200 && data.enteredUrl === data.canonicalUrl) {
                setIsUrlIndexable(true);
                setIndexabilityMessage("This URL can be indexed in search engines.");
            } else if (data.enteredUrlStatusCode === 200 && data.enteredUrl !== data.canonicalUrl) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("URL does not match its canonical URL, so this URL may not be indexed. Canonical URL may be indexed.");
            } else if (data.robotsCheck && !data.robotsCheck.allowed) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(data.robotsCheck.reason);
            } else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("URL redirects to another URL.");
            } else if (data.enteredUrlStatusCode === 404) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("URL does not exist (404).");
            } else if (data.enteredUrlStatusCode >= 400 && data.enteredUrlStatusCode < 500) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Client error (${data.enteredUrlStatusCode}). URL is not indexable.`);
            } else if (data.enteredUrlStatusCode >= 500 && data.enteredUrlStatusCode < 600) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Server error (${data.enteredUrlStatusCode}). URL is not indexable.`);
            } else if (data.enteredUrlStatusCode >= 100 && data.enteredUrlStatusCode < 200) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Informational response (${data.enteredUrlStatusCode}). URL is not indexable.`);
            } else if (data.enteredUrlStatusCode === 204) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("No content (204). Nothing to index.");
            } else {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Unhandled status code (${data.enteredUrlStatusCode}). Assuming not indexable.`);
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
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com"
                        required
                        disabled={isCheckingPage}
                        style={{width: '100%'}}
                    />

                    <br />

                    <input
                        type="submit"
                        value={isCheckingPage ? "Fetching data..." : "Check Page"}
                        disabled={!inputUrl || isCheckingPage}
                    />
                </form>

                {error
                    ? <p className="error-text">{error}</p>
                    : null
                }
            </section>

            {enteredUrlStatusCode === null || enteredUrlStatusCode === undefined
                ? null
                : <section>
                    <h2>URL</h2>
                    <Link href={analysedUrl} target="_blank">{analysedUrl}</Link>
                </section>
            }

            {isUrlIndexable === null
                ? null
                : <section>
                    <h2>Is the URL indexable?
                        <span
                            className={isUrlIndexable ? "success-text" : "error-text"}
                        >{isUrlIndexable ? " Yes" : " No"}</span>
                    </h2>
                    <p>{indexabilityMessage}</p>
                </section>
            }

            {robotsTxt
                ? <section>
                    <h2>Robots.txt</h2>
                    <p style={{ marginBottom: '10px'}}>
                        <Link href={robotsTxt.robotsUrl} target="_blank">{robotsTxt.robotsUrl}</Link>
                    </p>
                    <p>{robotsTxt.reason}</p>
                </section>
                : null
            }

            {enteredUrlStatusCode === null || enteredUrlStatusCode === undefined
                ? null
                : <section>
                    <h2>Status Code</h2>
                    <p>{enteredUrlStatusCode}</p>
                </section>
            }

            {metaRobotsTag
                ? <section>
                    <h2>Meta Robots</h2>
                    <p>{metaRobotsTag}</p>
                </section>
                : null
            }

            {canonicalUrl
                ? <section>
                    <h2>Canonical URL</h2>
                    <Link href={canonicalUrl} target="_blank">{canonicalUrl}</Link>
                </section>
                : null
            }

            {finalUrl
                ? <section>
                    <h2>Final URL</h2>
                    <p><Link href={finalUrl} target="_blank">{finalUrl}</Link></p>
                </section>
                : null
            }

            {redirectChain
                ? <section>
                    <h2>Redirect Chain</h2>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>#</th>
                                <th style={{ textAlign: 'left' }}>URL</th>
                                <th style={{ textAlign: 'center' }}>Status Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {redirectChain.map((redirect, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td><Link href={redirect.url}>{redirect.url}</Link></td>
                                        <td>{redirect.statusCode}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </section>
                : null
            }

            {metaTitles === null
                ? null
                : <section>
                    <h2>Meta Title</h2>
                    {metaTitles.length === 0
                        ? <p className="error-text">No &lt;title&gt; tag found.</p>
                        : <>
                            {metaTitles.length > 1
                                ? <p className="error-text">Multiple &lt;title&gt; tags found.</p>
                                : null
                            }
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metaTitles.map((metaTitle, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaTitle)}</td>
                                                <td style={{ textAlign: 'center' }} className={metaTitle.length > 60 ? 'error-background' : null}>{metaTitle.length}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    }
                </section>
            }

            {metaDescriptions === null
                ? null
                : <section>
                    <h2>Meta Description</h2>
                    {metaDescriptions.length === 0
                        ? <p className="error-text">No meta descriptions found.</p>
                        : <>
                            {metaDescriptions.length > 1
                                ? <p className="warning-text">Multiple meta descriptions found.</p>
                                : null
                            }
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metaDescriptions.map((metaDescription, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaDescription)}</td>
                                                <td style={{ textAlign: 'center' }} className={metaDescription.length > 160 ? 'error-background' : null}>{metaDescription.length}</td>
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
                    <h2>H1 Tags ({h1s.length})</h2>
                    {h1s.length === 0
                        ? <p className="error-text">No &lt;h1&gt; tag found.</p>
                        : <>
                            {h1s.length > 1
                                ? <p className="warning-text">Multiple &lt;H1&gt; tags found.</p>
                                : null
                            }
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {h1s.map((h1, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h1)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </>
                    }
                </section>
            }

            {h2s === null
                ? null
                : <section>
                    <h2>H2 Tags ({h2s.length})</h2>
                    {h2s.length === 0
                        ? <p>No &lt;H2&gt; tags found.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {h2s.map((h2, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h2)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {h3s === null
                ? null
                : <section>
                    <h2>H3 Tags ({h3s.length})</h2>
                    {h3s.length === 0
                        ? <p>No &lt;H3&gt; tags found.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {h3s.map((h3, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h3)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {h4s === null
                ? null
                : <section>
                    <h2>H4 Tags ({h4s.length})</h2>
                    {h4s.length === 0
                        ? <p>No &lt;H4&gt; tags found.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {h4s.map((h4, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h4)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {h5s === null
                ? null
                : <section>
                    <h2>H5 Tags ({h5s.length})</h2>
                    {h5s.length === 0
                        ? <p>No &lt;H5&gt; tags found.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {h5s.map((h5, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h5)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {h6s === null
                ? null
                : <section>
                    <h2>H6 Tags ({h6s.length})</h2>
                    {h6s.length === 0
                        ? <p>No &lt;H6&gt; tags found.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {h6s.map((h6, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h6)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {pageLinks === null
                ? null
                : <section>
                    <h2>Page Links  ({pageLinks.length})</h2>
                    {pageLinks.length === 0
                        ? <p>No links found on this page.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Anchor Text</th>
                                    <th style={{ textAlign: 'center' }}>Status Code</th>
                                    <th style={{ textAlign: 'left' }}>Link URL</th>
                                    <th style={{ textAlign: 'left' }}>Final URL</th>
                                    <th style={{ textAlign: 'left' }}>Redirect Chain</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageLinks.map((link, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td>{link.anchor || "(no text)"}</td>
                                        <td
                                            className={
                                                link.statusCode >= 300 && link.statusCode < 400
                                                ? 'warning-background'
                                                : link.statusCode >= 400
                                                    ? 'error-background'
                                                    : ''
                                            }
                                            style={{ textAlign: 'center' }}
                                        >{link.statusCode}</td>
                                        <td>
                                            <Link href={link.url} target="_blank">{link.url}</Link>
                                        </td>
                                        <td>
                                            <Link href={link.finalUrl} target="_blank">{link.finalUrl}</Link>
                                        </td>
                                        <td>
                                            <ol>
                                                {link.redirectChain && link.redirectChain.length > 1
                                                    ? link.redirectChain.map((r, idx) => (
                                                        <li key={idx}>
                                                            <Link href={r.url} target="_blank">{r.url}</Link> ({r.statusCode})
                                                            {idx < link.redirectChain.length - 1 ? " → " : ""}
                                                        </li>
                                                    ))
                                                    : "—"
                                                }
                                            </ol>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {images === null
                ? null
                : <section>
                    <h2>Images</h2>
                    {!images.length
                        ? "No images found"
                        : <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Image Preview</th>
                                    <th style={{ textAlign: 'left' }}>Alt Text</th>
                                    <th style={{ textAlign: 'left' }}>Source URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map((image, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td>
                                                <img
                                                    src={image.src || null}
                                                    alt={image.alt || ""}
                                                    loading="lazy"
                                                    style={{ height: "100px", width: "auto", maxWidth: "100px" }} 
                                                />
                                            </td>
                                            <td>{image.alt}</td>
                                            <td><Link href={image.src} target="_blank">{image.src}</Link></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }
        </>
    )
}