'use client';
import { useState } from "react";
import Link from "next/link";
import * as utils from '@/app/lib/utils';
import JsonLdViewer from "../components/jsonTree";
import RobotsTxt from "../components/robotsTxt";
import MetaRobotsTag from "../components/metaRobotsTag";
import CanonicalUrl from "../components/canonicalUrl";
import HttpRedirectsToHttps from "../components/httpRedirectsToHttps";
import RedirectChain from "../components/redirectChain";
import UrlIndexability from "../components/UrlIndexability";
import StatusCode from "../components/statusCode";
import FinalUrl from "../components/finalUrl";
import HtmlLanguageAttribute from "../components/htmlLanguageAttribute";
import Viewport from "../components/viewport";
import MetaTitle from "../components/metaTitle";
import MetaDescription from "../components/metaDescription";
import Headings from "../components/headings";
import InternalLinks from "../components/internalLinks";
import ExternalLinks from "../components/externalLinks";
import Images from "../components/images";
import SchemaMarkup from "../components/schemaMarkup";
import Hreflang from "../components/hreflang";
import OpenGraphTags from "../components/openGraphTags";

export default function ClientOnPageChecker() {
    const [inputUrl, setInputUrl] = useState("");
    const [enteredUrl, setEnteredUrl] = useState("");

    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [error, setError] = useState(null);

    const [isUrlIndexable, setIsUrlIndexable] = useState(null);
    const [indexabilityMessage, setIndexabilityMessage] = useState(null);
    const [enteredUrlStatusCode, setEnteredUrlStatusCode] = useState(null);
    const [finalUrl, setFinalUrl] = useState(null);
    const [finalUrlStatusCode, setFinalUrlStatusCode] = useState(null);
    const [redirectChain, setRedirectChain] = useState(null);
    const [isRedirectedToHttps, setIsRedirectedToHttps] = useState(null);
    const [robotsTxt, setRobotsTxt] = useState(null);
    const [metaRobotsTag, setMetaRobotsTag] = useState(null);
    const [canonicalUrl, setCanonicalUrl] = useState(null);
    const [metaTitle, setMetaTitle] = useState(null);
    const [metaDescription, setMetaDescription] = useState(null);
    const [h1s, setH1s] = useState(null);
    const [h2s, setH2s] = useState(null);
    const [h3s, setH3s] = useState(null);
    const [h4s, setH4s] = useState(null);
    const [h5s, setH5s] = useState(null);
    const [h6s, setH6s] = useState(null);
    const [internalLinks, setInternalLinks] = useState(null);
    const [externalLinks, setExternalLinks] = useState(null);
    const [images, setImages] = useState(null);
    const [schemaMarkup, setSchemaMarkup] = useState(null);
    const [hreflang, setHreflang] = useState(null);
    const [openGraphTags, setOpenGraphTags] = useState(null);
    const [htmlLanguageAttribute, setHtmlLanguageAttribute] = useState(null);
    const [viewport, setViewport] = useState(null);

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
        setFinalUrlStatusCode(null);
        setRedirectChain(null);
        setIsRedirectedToHttps(null);
        setRobotsTxt(null);
        setMetaRobotsTag(null);
        setCanonicalUrl(null);
        setMetaTitle(null);
        setMetaDescription(null);
        setH1s(null);
        setH2s(null);
        setH3s(null);
        setH4s(null);
        setH5s(null);
        setH6s(null);
        setInternalLinks(null);
        setExternalLinks(null);
        setImages(null);
        setSchemaMarkup(null);
        setHreflang(null);
        setOpenGraphTags(null);
        setHtmlLanguageAttribute(null);
        setViewport(null);

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
        setEnteredUrl(validatedUrl.href);

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
                setMetaTitle(data.metaTitle);
                setMetaDescription(data.metaDescription);
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
                setSchemaMarkup(resolvedJsonLdSchemas);
                setHreflang(data.hreflang);
                setOpenGraphTags(data.openGraphTags);
                setHtmlLanguageAttribute(data.htmlLanguageAttribute);
                setViewport(data.viewport);
            } else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setFinalUrl(data.finalUrl);
                setFinalUrlStatusCode(data.finalUrlStatusCode);
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
                        {isUrlIndexable && (<li><Link href="#is-url-indexable">URL is Indexable?</Link></li>)}
                        {enteredUrlStatusCode && (<li><Link href="#status-code">Status Code</Link></li>)}
                        {robotsTxt && (<li><Link href="#robots-txt">Robots.txt</Link></li>)}
                        {metaRobotsTag && (<li><Link href="#meta-robots-tag">Meta Robots Tag</Link></li>)}
                        {canonicalUrl && (<li><Link href="#canonical-url">Canonical URL</Link></li>)}
                        {htmlLanguageAttribute && (<li><Link href="#html-language-attribute">HTML Language Attribute</Link></li>)}
                        {viewport && (<li><Link href="#html-viewport">Viewport</Link></li>)}
                        {metaTitle && (<li><Link href="#meta-titles">Meta Title</Link></li>)}
                        {metaDescription && (<li><Link href="#meta-description">Meta Description</Link></li>)}
                        {h1s && (<li><Link href="#h1s">H1s</Link></li>)}
                        {h2s && (<li><Link href="#h2s">H2s</Link></li>)}
                        {h3s && (<li><Link href="#h3s">H3s</Link></li>)}
                        {h4s && (<li><Link href="#h4s">H4s</Link></li>)}
                        {h5s && (<li><Link href="#h5s">H5s</Link></li>)}
                        {h6s && (<li><Link href="#h6s">H6s</Link></li>)}
                        {internalLinks && (<li><Link href="#internal-links">Internal Links</Link></li>)}
                        {externalLinks && (<li><Link href="#external-links">External Links</Link></li>)}
                        {images && (<li><Link href="#images">Images</Link></li>)}
                        {schemaMarkup && (<li><Link href="#schema-markup">Schema Markup</Link></li>)}
                        {hreflang && (<li><Link href="#hreflang">Hreflang</Link></li>)}
                        {redirectChain && (<li><Link href="#redirect-chain">Redirect Chain</Link></li>)}
                        {openGraphTags && (<li><Link href="#open-graph-tags">Open Graph Tags</Link></li>)}
                    </ul>
                </section>
                : null
            }

            {enteredUrlStatusCode === null || enteredUrlStatusCode === undefined
                ? null
                : <section id="status-code">
                    <h2>URL</h2>
                    <Link href={enteredUrl} target="_blank">{enteredUrl}</Link>
                </section>
            }

            {isUrlIndexable === null
                ? null
                : <UrlIndexability
                    isUrlIndexable={isUrlIndexable}
                    indexabilityMessage={indexabilityMessage}
                />
            }

            {enteredUrlStatusCode === null || enteredUrlStatusCode === undefined
                ? null
                : <StatusCode enteredUrlStatusCode={enteredUrlStatusCode} />
            }

            {robotsTxt?.robotsUrl
                ? <RobotsTxt robotsTxt={robotsTxt} />
                : null
            }

            {metaRobotsTag
                ? <MetaRobotsTag metaRobotsTag={metaRobotsTag} />
                : null
            }

            {canonicalUrl
                ? <CanonicalUrl
                    enteredUrl={enteredUrl}
                    canonicalUrl={canonicalUrl}
                />
                : null
            }

            {isRedirectedToHttps
                ? <HttpRedirectsToHttps
                    isRedirectedToHttps={isRedirectedToHttps}
                    redirectChain={redirectChain}
                />
                : null
            }

            {finalUrl
                ? <FinalUrl
                    finalUrl={finalUrl}
                    finalUrlStatusCode={finalUrlStatusCode}
                />
                : null
            }

            {redirectChain
                ? <RedirectChain redirectChain={redirectChain} />
                : null
            }

            {htmlLanguageAttribute === null
                ? null
                : <HtmlLanguageAttribute htmlLanguageAttribute={htmlLanguageAttribute} />
            }

            {viewport === null
                ? null
                : <Viewport viewport={viewport} />
            }

            {metaTitle === null
                ? null
                : <MetaTitle metaTitle={metaTitle} />
            }

            {metaDescription === null
                ? null
                : <MetaDescription metaDescription={metaDescription} />
            }

            <Headings
                h1s={h1s}
                h2s={h2s}
                h3s={h3s}
                h4s={h4s}
                h5s={h5s}
                h6s={h6s}
            />

            {internalLinks === null
                ? null
                : <InternalLinks internalLinks={internalLinks} />
            }

            {externalLinks === null
                ? null
                : <ExternalLinks externalLinks={externalLinks} />
            }

            {images === null
                ? null
                : <Images images={images} />
            }

            {schemaMarkup === null
                ? null
                : <SchemaMarkup schemaMarkup={schemaMarkup} />
            }

            {hreflang === null
                ? null
                : <Hreflang hreflang={hreflang} />
            }

            {openGraphTags === null
                ? null
                : <OpenGraphTags openGraphTags={openGraphTags} />
            }
        </>
    )
}