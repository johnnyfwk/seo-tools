'use client';
import { useState } from "react";
import Link from "next/link";
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

    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [error, setError] = useState(null);

    const [pageData, setPageData] = useState({});

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

    // NEW: normalizer that PRESERVES the query/search for canonical comparison
    function normalizeUrlKeepSearch(url) {
        try {
            const u = new URL(url.trim());
            u.hostname = u.hostname.toLowerCase();
            u.hash = ""; // keep search but remove fragment
            // leave u.search intact (do NOT clear)
            if (u.pathname.endsWith("/") && u.pathname !== "/") {
                u.pathname = u.pathname.slice(0, -1);
            }
            // return full href including search
            return u.href;
        } catch {
            return url.trim();
        }
    }

    async function handleCheckPage() {
        setError(null);

        setPageData({
            enteredUrl: null,
            isUrlIndexable: null,
            indexabilityMessage: null,
            enteredUrlStatusCode: null,
            redirectChain: null,
            httpRedirectsToHttps: null,
            finalUrl: null,
            finalUrlStatusCode: null,
            robotsTxt: null,
            metaRobotsTag: null,
            canonicalUrl: null,
            metaTitle: null,
            metaDescription: null,
            headings: null,
            internalLinks: null,
            externalLinks: null,
            images: null,
            schemaMarkup: null,
            hreflang: null,
            openGraphTags: null,
            htmlLanguageAttribute: null,
            viewport: null,
        })

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
        setPageData({ enteredUrl: validatedUrl.href })

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
            // console.log("Data:", data);

            setPageData((currentPageData) => {
                return {
                    ...currentPageData,
                    enteredUrlStatusCode: data.enteredUrlStatusCode
                }                
            });

            if (data.error) {
                setError(data.error);
            } else if (data.enteredUrlStatusCode === 200) {
                const filteredjsonLdSchemas = data.schemas.filter(item => item.format.toLowerCase() === "json-ld");
                const resolvedJsonLdSchemas  = filteredjsonLdSchemas.flatMap(item => {
                    if (item.raw["@graph"]) {
                        return item.raw["@graph"]; // Yoast / multiple schemas
                    } else {
                        return [item.raw]; // single schema
                    }
                });

                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        robotsTxt: data.robotsTxt,
                        metaRobotsTag: data.metaRobotsTag,
                        canonicalUrl: data.canonicalUrl,
                        metaTitle: data.metaTitle,
                        metaDescription: data.metaDescription,
                        headings: {
                            h1s: data.h1s,
                            h2s: data.h2s,
                            h3s: data.h3s,
                            h4s: data.h4s,
                            h5s: data.h5s,
                            h6s: data.h6s,
                        },
                        internalLinks: data.internalLinks,
                        externalLinks: data.externalLinks,
                        images: data.images,
                        schemaMarkup: resolvedJsonLdSchemas,
                        hreflang: data.hreflang,
                        openGraphTags: data.openGraphTags,
                        htmlLanguageAttribute: data.htmlLanguageAttribute,
                        viewport: data.viewport,
                    }
                });
            } else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        redirectChain: data.redirectChain,
                        httpRedirectsToHttps: data.httpRedirectsToHttps,
                        finalUrl: data.finalUrl,
                        finalUrlStatusCode: data.finalUrlStatusCode,
                    }
                });
            } else if (data.enteredUrlStatusCode < 200 || data.enteredUrlStatusCode >= 600) {
                console.warn("Unhandled status code:", data.enteredUrlStatusCode);
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
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: data.robotsCheck.reason || "Blocked by robots.txt.",
                    }
                })
            } 
            else if (data.metaRobotsTag?.toLowerCase().includes("noindex")) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: "The Meta Robots Tag is set to 'noindex'.",
                    }
                })
            } 
            else if (data.xRobotsTag?.toLowerCase().includes("noindex")) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: "The X-Robots-Tag header is set to 'noindex'.",
                    }
                })
            }
            else if (data.enteredUrlStatusCode >= 300 && data.enteredUrlStatusCode < 400) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: "URL redirects to another URL.",
                    }
                })
            } 
            else if (data.enteredUrlStatusCode === 404) {

                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: "URL does not exist (404).",
                    }
                })
            } 
            else if (data.enteredUrlStatusCode >= 400 && data.enteredUrlStatusCode < 500) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: `Client error (${data.enteredUrlStatusCode}). URL is not indexable.`,
                    }
                })
            } 
            else if (data.enteredUrlStatusCode >= 500 && data.enteredUrlStatusCode < 600) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: `Server error (${data.enteredUrlStatusCode}). URL is not indexable.`,
                    }
                })
            } 
            else if (data.enteredUrlStatusCode >= 100 && data.enteredUrlStatusCode < 200) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: `Informational response (${data.enteredUrlStatusCode}). URL is not indexable.`,
                    }
                })
            } 
            else if (data.enteredUrlStatusCode === 204) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: "No content (204). Nothing to index.",
                    }
                })
            } 
            else if (
                canonical &&
                normalizeUrlKeepSearch(data.enteredUrl) !== normalizeUrlKeepSearch(canonical)
            ) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: "Canonical URL points to a different page. Search engines may index the canonical URL instead of the entered URL.",
                    }
                })
            } 
            else if (data.enteredUrlStatusCode === 200) {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: true,
                        indexabilityMessage: "URL can be indexed in search engines.",
                    }
                })
            } 
            else {
                setPageData((currentPageData) => {
                    return {
                        ...currentPageData,
                        isUrlIndexable: false,
                        indexabilityMessage: `Unhandled status code (${data.enteredUrlStatusCode ?? 'unknown'}). Assuming not indexable.`,
                    }
                })
            }

            setIsCheckingPage(false);
        } catch (err) {
            console.error(err)
            setError("Something went wrong.");
            setIsCheckingPage(false);
        }
    }
    
    console.log("Page Data:", pageData);

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

            {pageData.enteredUrlStatusCode === 200
                ? <section>
                    <h2>Contents</h2>
                    <ul>
                        {pageData.isUrlIndexable
                            ? <li>
                                <Link href="#is-url-indexable">Is the URL Indexable?</Link>
                            </li>
                            : null
                        }

                        {pageData.enteredUrlStatusCode
                            ? <li>
                                <Link href="#status-code">Status Code</Link>
                            </li>
                            : null
                        }

                        {pageData.robotsTxt
                            ? <li>
                                <Link href="#robots-txt">Robots.txt</Link>
                            </li>
                            : null
                        }

                        {pageData.metaRobotsTag
                            ? <li>
                                <Link href="#meta-robots-tag">Meta Robots Tag</Link>
                            </li>
                            : null
                        }

                        {pageData.canonicalUrl
                            ? <li>
                                <Link href="#canonical-url">Canonical URL</Link>
                            </li>
                            : null
                        }

                        {pageData.htmlLanguageAttribute
                            ? <li>
                                <Link href="#html-language-attribute">HTML Language Attribute</Link>
                            </li>
                            : null
                        }

                        {pageData.viewport
                            ? <li>
                                <Link href="#html-viewport">Viewport</Link>
                            </li>
                            : null
                        }

                        {pageData.metaTitle
                            ? <li>
                                <Link href="#meta-titles">Meta Title</Link>
                            </li>
                            : null
                        }

                        {pageData.metaDescription
                            ? <li>
                                <Link href="#meta-description">Meta Description</Link>
                            </li>
                            : null
                        }

                        {pageData.headings
                            ? <>
                                <li>
                                    <Link href="#h1s">H1s</Link>
                                </li>
                                <li>
                                    <Link href="#h2s">H2s</Link>
                                </li>
                                <li>
                                    <Link href="#h3s">H3s</Link>
                                </li>
                                <li>
                                    <Link href="#h4s">H4s</Link>
                                </li>
                                <li>
                                    <Link href="#h5s">H5s</Link>
                                </li>
                                <li>
                                    <Link href="#h6s">H6s</Link>
                                </li>
                            </>
                            : null
                        }

                        {pageData.internalLinks
                            ? <li>
                                <Link href="#internal-links">Internal Links</Link>
                            </li>
                            : null
                        }

                        {pageData.externalLinks
                            ? <li>
                                <Link href="#external-links">External Links</Link>
                            </li>
                            : null
                        }

                        {pageData.images
                            ? <li>
                                <Link href="#images">Images</Link>
                            </li>
                            : null
                        }

                        {pageData.schemaMarkup
                            ? <li>
                                <Link href="#schema-markup">Schema Markup</Link>
                            </li>
                            : null
                        }

                        {pageData.hreflang
                            ? <li>
                                <Link href="#hreflang">Hreflang</Link>
                            </li>
                            : null
                        }

                        {pageData.openGraphTags
                            ? <li>
                                <Link href="#open-graph-tags">Open Graph Tags</Link>
                            </li>
                            : null
                        }
                    </ul>
                </section>
                : null
            }

            {pageData.enteredUrlStatusCode
                ? <section>
                    <h2>URL</h2>
                    <Link href={pageData.enteredUrl} target="_blank">{pageData.enteredUrl}</Link>
                </section>
                : null
            }

            {pageData.isUrlIndexable  !== null && pageData.isUrlIndexable !== undefined
                ? <UrlIndexability
                    isUrlIndexable={pageData.isUrlIndexable}
                    indexabilityMessage={pageData.indexabilityMessage}
                />
                : null
            }

            {pageData.enteredUrlStatusCode
                ? <StatusCode enteredUrlStatusCode={pageData.enteredUrlStatusCode} />
                : null
            }

            
            {pageData.httpRedirectsToHttps
                ? <HttpRedirectsToHttps
                    httpRedirectsToHttps={pageData.httpRedirectsToHttps}
                    redirectChain={pageData.redirectChain}
                />
                : null
            }

            {pageData.finalUrl
                ? <FinalUrl
                    finalUrl={pageData.finalUrl}
                    finalUrlStatusCode={pageData.finalUrlStatusCode}
                />
                : null
            }

            {pageData.redirectChain
                ? <RedirectChain redirectChain={pageData.redirectChain} />
                : null
            }

            {pageData.robotsTxt
                ? <RobotsTxt robotsTxt={pageData.robotsTxt} />
                : null
            }

            {pageData.metaRobotsTag
                ? <MetaRobotsTag metaRobotsTag={pageData.metaRobotsTag} />
                : null
            }

            {pageData.canonicalUrl
                ? <CanonicalUrl
                    enteredUrl={pageData.enteredUrl}
                    canonicalUrl={pageData.canonicalUrl}
                />
                : null
            }

            {pageData.htmlLanguageAttribute
                ? <HtmlLanguageAttribute htmlLanguageAttribute={pageData.htmlLanguageAttribute} />
                : null
            }

            {pageData.viewport
                ? <Viewport viewport={pageData.viewport} />
                : null
            }

            {pageData.metaTitle
                ? <MetaTitle metaTitle={pageData.metaTitle} />
                : null
            }

            {pageData.metaDescription
                ? <MetaDescription metaDescription={pageData.metaDescription} />
                : null
            }

            {pageData.headings
                ? <Headings
                    h1s={pageData.headings.h1s}
                    h2s={pageData.headings.h2s}
                    h3s={pageData.headings.h3s}
                    h4s={pageData.headings.h4s}
                    h5s={pageData.headings.h5s}
                    h6s={pageData.headings.h6s}
                />
                : null
            }
            
            {pageData.internalLinks
                ? <InternalLinks internalLinks={pageData.internalLinks} />
                : null
            }

            {pageData.externalLinks
                ? <ExternalLinks externalLinks={pageData.externalLinks} />
                : null
            }

            {pageData.images
                ? <Images images={pageData.images} />
                : null
            }

            {pageData.schemaMarkup
                ? <SchemaMarkup schemaMarkup={pageData.schemaMarkup} />
                : null
            }

            {pageData.hreflang
                ? <Hreflang hreflang={pageData.hreflang} />
                : null
            }

            {pageData.openGraphTags
                ? <OpenGraphTags openGraphTags={pageData.openGraphTags} />
                : null
            }
        </>
    )
}