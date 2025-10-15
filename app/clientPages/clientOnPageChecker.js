'use client';
import { useState } from "react";
import Link from "next/link";
import * as utils from '@/app/lib/utils';
import JsonLdViewer from "../components/jsonTree";

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
    const [isRedirectedToHttps, setIsRedirectedToHttps] = useState(null);
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
    const [internalLinks, setInternalLinks] = useState(null);
    const [externalLinks, setExternalLinks] = useState(null);
    const [images, setImages] = useState(null);
    const [jsonLdSchemas, setJsonLdSchemas] = useState(null);
    const [hreflangs, setHreflangs] = useState(null);
    const [openGraphTags, setOpenGraphTags] = useState(null);
    const [htmlLang, setHtmlLang] = useState(null);

    function normalizeUrl(url) {
        try {
            const u = new URL(url.trim());

            // Lowercase hostname (domains are case-insensitive)
            u.hostname = u.hostname.toLowerCase();

            // Remove hash (#fragment) and query parameters (?utm= etc.)
            u.hash = "";
            u.search = "";

            // Remove trailing slash unless it's the root
            if (u.pathname.endsWith("/") && u.pathname !== "/") {
                u.pathname = u.pathname.slice(0, -1);
            }

            return u.href;
        } catch {
            return url.trim();
        }
    }

    async function handleCheckPage() {
        setError(null);
        setIsUrlIndexable(null);
        setIndexabilityMessage(null);
        setEnteredUrlStatusCode(null);
        setFinalUrl(null);
        setRedirectChain(null);
        setIsRedirectedToHttps(null);
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
        setInternalLinks(null);
        setExternalLinks(null);
        setImages(null);
        setJsonLdSchemas(null);
        setHreflangs(null);
        setOpenGraphTags(null);
        setHtmlLang(null);

        let input = inputUrl.trim();

        if (!/^https?:\/\//i.test(input)) {
            input = 'http://' + input; // prepend protocol if missing
        }

        // Validate URL
        let validatedUrl;
        try {
            validatedUrl = new URL(input);
        } catch (err) {
            console.error(err);
            setError("Please enter a valid URL (starting with http:// or https://).");
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

            if (!res.ok) {
                setError(`Request failed: ${res.status}`);
                setIsCheckingPage(false);
                return;
            }

            const data = await res.json();
            console.log(data);

            setEnteredUrlStatusCode(data.enteredUrlStatusCode);

            if (data.error) {
                setError(data.error);
            } else if (data.enteredUrlStatusCode === 200) {
                setRobotsTxt(data.robotsCheck);
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
                setInternalLinks(data.internalLinks);
                setExternalLinks(data.externalLinks);
                setImages(data.images);
                const filteredjsonLdSchemas = data.schemas.filter(item => item.format.toLowerCase() === "json-ld");
                const resolvedJsonLdSchemas  = filteredjsonLdSchemas.flatMap(item => {
                    if (item.raw["@graph"]) {
                        return item.raw["@graph"]; // Yoast / multiple schemas
                    } else {
                        return [item.raw]; // single schema
                    }
                });
                setJsonLdSchemas(resolvedJsonLdSchemas);
                setHreflangs(data.hreflangs);
                setOpenGraphTags(data.openGraphTags);
                setHtmlLang(data.htmlLangAttribute);
            } else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setFinalUrl(data.finalUrl);
                setRedirectChain(data.redirectChain);
                setIsRedirectedToHttps(data.redirectsToHttps);
            } else if (data.enteredUrlStatusCode >= 400 && data.enteredUrlStatusCode < 600) {
                setFinalUrl(data.finalUrl);
            } else {
                // Unexpected status code (outside 200–599 range)
                console.warn("Unhandled status code:", data.enteredUrlStatusCode);
                setFinalUrl(data.finalUrl);
            }

            const entered = normalizeUrl(data.enteredUrl);

            // Safely resolve canonical relative to entered URL (only here)
            let canonical;
            try {
                canonical = data.canonicalUrl ? new URL(data.canonicalUrl, entered).href : null;
            } catch {
                canonical = null;
            }

            if (data.robotsCheck && !data.robotsCheck.allowed) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(data.robotsCheck.reason || "Blocked by robots.txt.");
            } 
            else if (data.metaRobotsTag?.toLowerCase().includes("noindex")) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("The Meta Robots Tag is set to 'noindex'.");
            } 
            else if (data.xRobotsTag?.toLowerCase().includes("noindex")) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("The X-Robots-Tag header is set to 'noindex'.");
            }
            else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("URL redirects to another URL.");
            } 
            else if (data.enteredUrlStatusCode === 404) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("URL does not exist (404).");
            } 
            else if (data.enteredUrlStatusCode >= 400 && data.enteredUrlStatusCode < 500) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Client error (${data.enteredUrlStatusCode}). URL is not indexable.`);
            } 
            else if (data.enteredUrlStatusCode >= 500 && data.enteredUrlStatusCode < 600) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Server error (${data.enteredUrlStatusCode}). URL is not indexable.`);
            } 
            else if (data.enteredUrlStatusCode >= 100 && data.enteredUrlStatusCode < 200) {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Informational response (${data.enteredUrlStatusCode}). URL is not indexable.`);
            } 
            else if (data.enteredUrlStatusCode === 204) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("No content (204). Nothing to index.");
            } 
            else if (canonical && normalizeUrl(entered) !== normalizeUrl(canonical)) {
                setIsUrlIndexable(false);
                setIndexabilityMessage("Canonical URL points to a different page. Search engines may index the canonical URL instead of the entered URL.");
            } 
            else if (data.enteredUrlStatusCode === 200) {
                setIsUrlIndexable(true);
                setIndexabilityMessage("URL can be indexed in search engines.");
            } 
            else {
                setIsUrlIndexable(false);
                setIndexabilityMessage(`Unhandled status code (${data.enteredUrlStatusCode ?? 'unknown'}). Assuming not indexable.`);
            }

            setIsCheckingPage(false);
        } catch (err) {
            console.error(err)
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
                        type="text"
                        name="url"
                        id="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com or http://example.com"
                        required
                        disabled={isCheckingPage}
                        style={{width: '100%', padding: "10px"}}
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

            {enteredUrlStatusCode === 200
                ? <section>
                    <h2>Contents</h2>
                    <ul>
                        {isUrlIndexable && (<li><Link href="#on-page-checker-url-is-indexable">URL is Indexable?</Link></li>)}
                        {enteredUrlStatusCode && (<li><Link href="#on-page-checker-status-code">Status Code</Link></li>)}
                        {robotsTxt && (<li><Link href="#on-page-checker-robots-txt">Robots.txt</Link></li>)}
                        {metaRobotsTag && (<li><Link href="#on-page-checker-meta-robots-tag">Meta Robots Tag</Link></li>)}
                        {canonicalUrl && (<li><Link href="#on-page-checker-canonical-url">Canonical URL</Link></li>)}
                        {htmlLang && (<li><Link href="#on-page-checker-html-language-attribute">HTML Language Attribute</Link></li>)}
                        {metaTitles && (<li><Link href="#on-page-checker-meta-titles">Meta Title</Link></li>)}
                        {metaDescriptions && (<li><Link href="#on-page-checker-meta-description">Meta Description</Link></li>)}
                        {h1s && (<li><Link href="#on-page-checker-h1s">H1s</Link></li>)}
                        {h2s && (<li><Link href="#on-page-checker-h2s">H2s</Link></li>)}
                        {h3s && (<li><Link href="#on-page-checker-h3s">H3s</Link></li>)}
                        {h4s && (<li><Link href="#on-page-checker-h4s">H4s</Link></li>)}
                        {h5s && (<li><Link href="#on-page-checker-h5s">H5s</Link></li>)}
                        {h6s && (<li><Link href="#on-page-checker-h6s">H6s</Link></li>)}
                        {internalLinks && (<li><Link href="#on-page-checker-internal-links">Internal Links</Link></li>)}
                        {externalLinks && (<li><Link href="#on-page-checker-external-links">External Links</Link></li>)}
                        {images && (<li><Link href="#on-page-checker-images">Images</Link></li>)}
                        {jsonLdSchemas && (<li><Link href="#on-page-checker-schema-markup">Schema Markup</Link></li>)}
                        {hreflangs && (<li><Link href="#on-page-checker-hreflang">Hreflang</Link></li>)}
                        {redirectChain && (<li><Link href="#on-page-checker-redirect-chain">Redirect Chain</Link></li>)}
                        {openGraphTags && (<li><Link href="#on-page-checker-open-graph-tags">Open Graph Tags</Link></li>)}
                    </ul>
                </section>
                : null
            }

            {enteredUrlStatusCode === null || enteredUrlStatusCode === undefined
                ? null
                : <section id="on-page-checker-status-code">
                    <h2>URL</h2>
                    <Link href={analysedUrl} target="_blank">{analysedUrl}</Link>
                </section>
            }

            {isUrlIndexable === null
                ? null
                : <section id="on-page-checker-url-is-indexable">
                    <h2>URL is indexable? <span className={isUrlIndexable ? "success-text" : "error-text"}>{isUrlIndexable ? "Yes" : "No"}</span></h2>
                    <p>{indexabilityMessage}</p>
                </section>
            }

            {enteredUrlStatusCode === null || enteredUrlStatusCode === undefined
                ? null
                : <section id="on-page-checker-status-code">
                    <h2>Status Code: <span className={enteredUrlStatusCode === 200 ? "success-text" : enteredUrlStatusCode >= 300 && enteredUrlStatusCode < 400 ? "warning-text" : "error-text"}>{enteredUrlStatusCode}</span></h2>
                </section>
            }

            {robotsTxt?.robotsUrl
                ? <section id="on-page-checker-robots-txt">
                    <h2>URL allowed by Robots.txt? <span className={robotsTxt.allowed ? "success-text" : "error-text"}>{robotsTxt.allowed ? "Yes" : "No"}</span></h2>
                    <p style={{ marginBottom: '10px'}}>
                        <Link href={robotsTxt.robotsUrl} target="_blank">{robotsTxt.robotsUrl}</Link>
                    </p>
                </section>
                : null
            }

            {metaRobotsTag
                ? <section id="on-page-checker-meta-robots-tag">
                    <h2>
                        Meta Robots Tag allows indexing?{" "}
                        <span
                            className={
                            metaRobotsTag.toLowerCase().includes("noindex")
                                ? "warning-text"   // orange/yellow for noindex
                                : "success-text"   // green for index/follow or unspecified
                            }
                        >
                            {metaRobotsTag.toLowerCase().includes("noindex") ? "No" : "Yes"}
                        </span>
                    </h2>
                    <p>{metaRobotsTag}</p>
                </section>
                : null
            }

            {canonicalUrl
                ? <section id="on-page-checker-canonical-url">
                    <h2>URL has a self-referencing Canonical URL? <span className={analysedUrl.replace(/\/$/, '') === canonicalUrl.replace(/\/$/, '') ? "success-text" : "warning-text"}>{analysedUrl.replace(/\/$/, '') === canonicalUrl.replace(/\/$/, '') ? "Yes" : "No"}</span></h2>
                    <Link href={canonicalUrl} target="_blank">{canonicalUrl}</Link>
                </section>
                : null
            }

            {isRedirectedToHttps
                ? <section>
                    <h2>HTTP redirects to HTTPS? <span className={isRedirectedToHttps ? "success-text" : "error-text"}>{isRedirectedToHttps ? "Yes" : "No"}</span></h2>
                    <p>URL redirects to <Link href={redirectChain[1].url} target="_blank">{redirectChain[1].url}</Link>.</p>
                </section>
                : null
            }

            {finalUrl
                ? <section id="on-page-checker-final-url">
                    <h2>Final URL</h2>
                    <p><Link href={finalUrl} target="_blank">{finalUrl}</Link> ({redirectChain[redirectChain.length - 1].statusCode})</p>
                </section>
                : null
            }

            {redirectChain
                ? <section id="on-page-checker-redirect-chain">
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
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}><Link href={redirect.url}>{redirect.url}</Link></td>
                                        <td style={{ textAlign: 'center' }}>{redirect.statusCode}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </section>
                : null
            }

            {htmlLang === null
                ? null
                : <section id="on-page-checker-html-language-attribute">
                    <h2>HTML Language Attribute</h2>
                    {htmlLang
                        ? <p>{htmlLang}</p>
                        : <p>No HTML language attribute found.</p>
                    }
                </section>
            }

            {metaTitles === null
                ? null
                : <section id="on-page-checker-meta-titles">
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
                : <section id="on-page-checker-meta-description">
                    <h2>Meta Description</h2>
                    {metaDescriptions.length === 0
                        ? <p className="error-text">No meta description found.</p>
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
                : <section id="on-page-checker-h1s">
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
                : <section id="on-page-checker-h2s">
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
                : <section id="on-page-checker-h3s">
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
                : <section id="on-page-checker-h4s">
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
                : <section id="on-page-checker-h5s">
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
                : <section id="on-page-checker-h6s">
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

            {internalLinks === null
                ? null
                : <section id="on-page-checker-internal-links">
                    <h2>Internal Links ({internalLinks.length})</h2>
                    {internalLinks.length === 0
                        ? <p>No internal links found on this page.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Anchor Text</th>
                                    <th style={{ textAlign: 'left' }}>Link URL</th>
                                    <th style={{ textAlign: 'center' }}>Status Code</th>
                                    <th style={{ textAlign: 'left' }}>Final URL</th>
                                    <th style={{ textAlign: 'left' }}>Redirect Chain</th>
                                </tr>
                            </thead>
                            <tbody>
                                {internalLinks.map((link, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td>
                                            {link.anchor?.type === 'image' ? (
                                                <img 
                                                    src={link.anchor.src} 
                                                    alt={link.anchor.alt || 'Image link'} 
                                                    style={{ minWidth: "100px", maxWidth: "100px" }}
                                                />
                                            ) : (
                                                link.anchor?.text || "(no text)"
                                            )}
                                        </td>
                                        <td>
                                            <Link href={link.url} target="_blank">{link.url}</Link>
                                        </td>
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

            {externalLinks === null
                ? null
                : <section id="on-page-checker-external-links">
                    <h2>External Links ({externalLinks.length})</h2>
                    {externalLinks.length === 0
                        ? <p>No external links found on this page.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Anchor Text</th>
                                    <th style={{ textAlign: 'left' }}>Link URL</th>
                                    <th style={{ textAlign: 'center' }}>Status Code</th>
                                    <th style={{ textAlign: 'left' }}>Final URL</th>
                                    <th style={{ textAlign: 'left' }}>Redirect Chain</th>
                                </tr>
                            </thead>
                            <tbody>
                                {externalLinks.map((link, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td>
                                            {link.anchor?.type === 'image' ? (
                                                <img 
                                                    src={link.anchor.src} 
                                                    alt={link.anchor.alt || 'Image link'} 
                                                    style={{ minWidth: "100px", maxWidth: "100px" }}
                                                    />
                                                ) : (
                                                    link.anchor?.text || "(no text)"
                                                )}
                                            </td>
                                        <td>
                                            <Link href={link.url} target="_blank">{link.url}</Link>
                                        </td>
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
                : <section id="on-page-checker-images">
                    <h2>Images ({images.length || 0})</h2>
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
                                                    src={image.src || undefined}
                                                    alt={image.alt || ""}
                                                    loading="lazy"
                                                    style={{ minWidth: "100px", maxWidth: "100px" }}
                                                />
                                            </td>
                                            <td className={!image.alt ? "error-background" : undefined}>{image.alt}</td>
                                            <td><Link href={image.src} target="_blank">{image.src}</Link></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {jsonLdSchemas === null
                ? null
                : <section id="on-page-checker-schema-markup">
                    <h2>Schema Markup ({jsonLdSchemas.length || 0})</h2>
                    {!jsonLdSchemas.length
                        ? <p>No schema markup found.</p>
                        : <JsonLdViewer jsonLdSchemas={jsonLdSchemas} />
                    }
                </section>
            }

            {hreflangs === null
                ? null
                : <section id="on-page-checker-hreflang">
                    <h2>Hreflang ({hreflangs?.length || 0})</h2>
                    {!hreflangs?.length
                        ? <p>No hreflang found.</p>
                        : <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>Source</th>
                                    <th style={{ textAlign: 'center' }}>Hreflang</th>
                                    <th style={{ textAlign: 'left' }}>URL</th>
                                    <th style={{ textAlign: 'center' }}>Status Code</th>
                                    <th style={{ textAlign: 'center' }}>URL is Indexable?</th>
                                    <th style={{ textAlign: 'left' }}>Final URL</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {hreflangs.map((hreflang, index) => {
                                    return (
                                        <tr key={index}>
                                            <td style={{ textAlign: 'center' }}>{hreflang.source}</td>
                                            <td style={{ textAlign: 'center' }}>{hreflang.hreflang}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                <Link href={hreflang.url} target="_blank">{hreflang.url}</Link>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{hreflang.statusCode}</td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className={!hreflang.isIndexable ? "error-background" : undefined }
                                            >{hreflang.isIndexable ? "Yes" : "No"}</td>
                                            <td style={{ textAlign: 'left' }}>
                                                <Link href={hreflang.finalUrl} target="_blank">{hreflang.finalUrl}</Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </section>
            }

            {openGraphTags === null
                ? null
                : <section id="on-page-checker-open-graph-tags">
                    <h2>Open Graph Tags</h2>

                    {openGraphTags.missingTags.length ? (
                        <div>
                            <h3>Missing Tags:</h3>
                            <ul>
                                {openGraphTags.missingTags.map((tag, index) => (
                                    <li key={index}>{tag}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* Only show table if any real OG tag (not empty or null) exists */}
                    {[
                        openGraphTags.siteName,
                        openGraphTags.url,
                        openGraphTags.isOgUrlIndexable,
                        openGraphTags.ogUrlStatusCode,
                        openGraphTags.ogUrlFinalUrl,
                        openGraphTags.title,
                        openGraphTags.description,
                        openGraphTags.type,
                        openGraphTags.image,
                        openGraphTags.locale,
                        openGraphTags.audio,
                        openGraphTags.video,
                        openGraphTags.determiner
                    ].some(value => value && value !== '') && (
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Tag</th>
                                    <th style={{ textAlign: 'left' }}>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openGraphTags.siteName && (
                                    <tr>
                                        <td><strong>Site Name</strong></td>
                                        <td>{openGraphTags.siteName}</td>
                                    </tr>
                                )}
                                {openGraphTags.url && (
                                    <tr>
                                        <td><strong>URL</strong></td>
                                        <td><Link href={openGraphTags.url} target="_blank">{openGraphTags.url}</Link></td>
                                    </tr>
                                )}
                                {openGraphTags.isOgUrlIndexable !== '' && (
                                    <tr>
                                        <td><strong>Is URL Indexable?</strong></td>
                                        <td>{openGraphTags.isOgUrlIndexable ? "Yes" : "No"}</td>
                                    </tr>
                                )}
                                {openGraphTags.ogUrlStatusCode && (
                                    <tr>
                                        <td><strong>Status Code</strong></td>
                                        <td>{openGraphTags.ogUrlStatusCode}</td>
                                    </tr>
                                )}
                                {openGraphTags.ogUrlFinalUrl && (
                                    <tr>
                                        <td><strong>Final URL</strong></td>
                                        <td><Link href={openGraphTags.ogUrlFinalUrl} target="_blank">{openGraphTags.ogUrlFinalUrl}</Link></td>
                                    </tr>
                                )}
                                {openGraphTags.title && (
                                    <tr>
                                        <td><strong>Title</strong></td>
                                        <td>{openGraphTags.title}</td>
                                    </tr>
                                )}
                                {openGraphTags.description && (
                                    <tr>
                                        <td><strong>Description</strong></td>
                                        <td>{openGraphTags.description}</td>
                                    </tr>
                                )}
                                {openGraphTags.type && (
                                    <tr>
                                        <td><strong>Type</strong></td>
                                        <td>{openGraphTags.type}</td>
                                    </tr>
                                )}
                                {openGraphTags.image && (
                                    <tr>
                                        <td><strong>Image</strong></td>
                                        <td>
                                            <img
                                                src={openGraphTags.image || undefined}
                                                alt="Open Graph Tag Image"
                                                style={{ minWidth: "100px", maxWidth: "200px" }}
                                            />
                                        </td>
                                    </tr>
                                )}
                                {openGraphTags.locale && (
                                    <tr>
                                        <td><strong>Locale</strong></td>
                                        <td>{openGraphTags.locale}</td>
                                    </tr>
                                )}
                                {openGraphTags.audio && (
                                    <tr>
                                        <td><strong>Audio</strong></td>
                                        <td>{openGraphTags.audio}</td>
                                    </tr>
                                )}
                                {openGraphTags.video && (
                                    <tr>
                                        <td><strong>Video</strong></td>
                                        <td>{openGraphTags.video}</td>
                                    </tr>
                                )}
                                {openGraphTags.determiner && (
                                    <tr>
                                        <td><strong>Determiner</strong></td>
                                        <td>{openGraphTags.determiner}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </section>
            }
        </>
    )
}