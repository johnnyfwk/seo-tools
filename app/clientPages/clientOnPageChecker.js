'use client';

import { useState } from "react";
import Url from "../components/url";
import Indexability from "../components/indexability";
import StatusCode from "../components/statusCode";
import RedirectChain from "../components/redirectChain";
import HttpRedirectsToHttps from "../components/httpRedirectsToHttps";
import MetaTitle from "../components/metaTitle";
import MetaDescription from "../components/metaDescription";
import Headings from "../components/headings";
import RobotsTxt from "../components/robotsTxt";
import MetaRobotsTag from "../components/metaRobotsTag";
import CanonicalTag from "../components/canonicalTag";
import HtmlLanguageAttribute from "../components/htmlLanguageAttribute";
import Viewport from "../components/viewport";
import InternalLinks from "../components/internalLinks";
import ExternalLinks from "../components/externalLinks";
import SchemaMarkup from "../components/schemaMarkup";
import Images from "../components/images";
import Hreflang from "../components/hreflang";
import OpenGraph from "../components/openGraph";
import XmlSitemap from "../components/xmlSitemap";

export default function ClientOnPageChecker() {
    const initialPageData = {
        enteredUrl: null,
        enteredUrlStatusCode: null,
        enteredUrlFetchError: null,
        finalUrl: null,
        finalUrlStatusCode: null,
        finalUrlFetchError: null,
        httpRedirectsToHttps: null,
        redirectChain: [],
        robotsTxt: null,
        metaRobotsTag: null,
        canonicalTag: {},
        htmlLanguageAttribute: null,
        viewport: null,
        metaTitle: [],
        metaDescription: [],
        headings: {},
        links: null,
        images: [],
        schemaMarkup: [],
        hreflang: [],
        openGraph: {},
        xmlSitemap: {},
    };

    const [inputUrl, setInputUrl] = useState("");
    const [isCheckingPage, setIsCheckingPage] = useState(false);
    const [hasCheckedPage, setHasCheckedPage] = useState(false);
    const [error, setError] = useState(null);
    const [pageData, setPageData] = useState(initialPageData);
    const [scrapeEvenIfBlocked, setScrapeEvenIfBlocked] = useState(false);

    async function handleCheckPage() {
        setError(null);
        setHasCheckedPage(false);
        setPageData(initialPageData);

        let input = inputUrl.trim();

        if (!/^https?:\/\//i.test(input)) {
            input = 'http://' + input;
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

        // Start timer
        const startTime = performance.now();

        try {
            const res = await fetch('/api/on-page-checker', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enteredUrl: validatedUrl.href,
                    scrapeEvenIfBlocked
                }),
            });

            if (!res.ok) {
                setError(`Request failed: ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log("Data:", data);

            const endTime = performance.now();
            const elapsedMs = endTime - startTime;
            console.log(`Scraping took ${elapsedMs.toFixed(2)} ms`);

            setPageData({
                ...initialPageData,
                ...data,
                scrapeDurationMs: elapsedMs,
                metaRobotsTag: data.metaRobotsTag || "",
                canonicalTag: data.canonicalTag || {},
                htmlLanguageAttribute: data.htmlLanguageAttribute || "",
                viewport: data.viewport || "",
                metaTitle: data.metaTitle || [],
                metaDescription: data.metaDescription || [],
                headings: data.headings || {},
                links: data.links || {},
                images: data.images || [],
                schemaMarkup: data.schemaMarkup || [],
                hreflang: data.hreflang || [],
                openGraph: data.openGraph || {},
                xmlSitemap: data.xmlSitemap || {},
            });

        } catch (err) {
            console.error(err)
            setError("Something went wrong.");
        } finally {
            setHasCheckedPage(true);
            setIsCheckingPage(false);
        }
    }

    function formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor(ms % 1000);
        return seconds > 0 ? `${seconds}s ${milliseconds}ms` : `${milliseconds}ms`;
    }

    const sections = [
        pageData.scrapeDurationMs
            ? {
                title: "Scrape Duration",
                component: <p>{formatDuration(pageData.scrapeDurationMs)}</p>,
            }
            : null,
        {
            title: "URL",
            component: <Url url={pageData.enteredUrl} />,
        },
        {
            title: "Indexability",
            component: <Indexability
                statusCode={pageData.enteredUrlStatusCode}
                isAllowedByRobotsTxt={pageData.robotsTxt?.allowed ?? true}
                metaRobotsTagAllowsIndexing={pageData.metaRobotsTag?.allowsIndexing ?? true}
                canonicalTagIsSelfReferential={pageData.canonicalTag?.isSelfReferential ?? true}
            />
        },
        {
            title: "Status Code",
            component: <StatusCode
                statusCode={pageData.enteredUrlStatusCode}
                fetchError={pageData.enteredUrlFetchError}
            />,
        },

        pageData.enteredUrlStatusCode >= 300 &&
        pageData.enteredUrlStatusCode < 400
            ? {
                title: "HTTP redirects to HTTPS?",
                component: <HttpRedirectsToHttps redirectChain={pageData.redirectChain} />,
            }
            : null,

        pageData.redirectChain.length > 1
            ? {
                title: "Redirect URL",
                component: <Url url={pageData.redirectChain[1].url} />,
            }
            : null,

        pageData.redirectChain.length > 1
            ? {
                title: "Final URL",
                component: <Url url={pageData.redirectChain[pageData.redirectChain.length - 1].url} />,
            }
            : null,

        pageData.redirectChain.length > 1 &&
        pageData.enteredUrlStatusCode >= 300 &&
        pageData.enteredUrlStatusCode < 400
            ? {
                title: "Redirect Chain",
                component: <RedirectChain redirectChain={pageData.redirectChain} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Robots.txt",
                component: <RobotsTxt robotsTxt={pageData.robotsTxt} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Meta Robots Tag",
                component: <MetaRobotsTag metaRobotsTag={pageData.metaRobotsTag} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Canonical Tag",
                component: <CanonicalTag canonicalTag={pageData.canonicalTag} />,
            }
            : null,
        
        pageData.enteredUrlStatusCode === 200
            ? {
                title: "HTML Language Attribute",
                component: <HtmlLanguageAttribute htmlLanguageAttribute={pageData.htmlLanguageAttribute} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Viewport",
                component: <Viewport viewport={pageData.viewport} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Meta Title",
                component: <MetaTitle metaTitle={pageData.metaTitle} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Meta Description",
                component: <MetaDescription metaDescription={pageData.metaDescription} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Headings",
                component: <Headings
                    h1s={pageData.headings.h1s}
                    h2s={pageData.headings.h2s}
                    h3s={pageData.headings.h3s}
                    h4s={pageData.headings.h4s}
                    h5s={pageData.headings.h5s}
                    h6s={pageData.headings.h6s}
                />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: `Internal Links (${pageData.links?.internal?.length || 0})`,
                component: <InternalLinks internalLinks={pageData.links?.internal || []} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: `External Links (${pageData.links?.external?.length || 0})`,
                component: <ExternalLinks externalLinks={pageData.links?.external || []} />,
            }
            : null,
        
        pageData.enteredUrlStatusCode === 200
            ? {
                title: `Images (${pageData.images.length})`,
                component: <Images images={pageData.images} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: `Schema Markeup (${pageData.schemaMarkup.filter(s => s.format === 'JSON-LD').length})`,
                component: <SchemaMarkup schemaMarkup={pageData.schemaMarkup} />,
            }
            : null,
        
        pageData.enteredUrlStatusCode === 200
            ? {
                title: `Hreflang (${pageData.hreflang.length})`,
                component: <Hreflang hreflang={pageData.hreflang} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "Open Graph",
                component: <OpenGraph openGraph={pageData.openGraph} />,
            }
            : null,

        pageData.enteredUrlStatusCode === 200
            ? {
                title: "XML Sitemap",
                component: <XmlSitemap xmlSitemap={pageData.xmlSitemap} />
            }
            : null
    ].filter(Boolean);

    return (
        <>
            <section>
                <h1>On-Page Checker</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCheckPage();
                    }}
                    aria-busy={isCheckingPage}
                >
                    <fieldset disabled={isCheckingPage} style={{ border: "none", padding: 0 }}>
                        <legend className="sr-only">URL Checker Form</legend>

                        <label htmlFor="url"><strong>Enter URL:</strong></label>

                        <input
                            id="url"
                            type="text"
                            value={inputUrl}
                            onChange={(e) => {
                                setInputUrl(e.target.value);
                                if (error) setError(null);
                            }}
                            placeholder="https://example.com"
                            aria-invalid={!!error}
                            aria-describedby={error ? "url-error" : undefined}
                            style={{width: '100%', padding: "10px"}}
                        />

                        {error
                            ? <p
                                id="url-error"
                                className="error-text"
                                role="alert"
                            >{error}</p>
                            : null
                        }

                        <label>
                            <input
                                type="checkbox"
                                checked={scrapeEvenIfBlocked}
                                onChange={(e) => setScrapeEvenIfBlocked(e.target.checked)}
                            />
                            Ignore robots.txt
                        </label>

                        <br />

                        <button
                            type="submit"
                            disabled={isCheckingPage || !inputUrl || !!error}
                        >
                            {isCheckingPage ? "Fetching..." : "Check Page"}
                        </button>
                    </fieldset>
                </form>
            </section>
            
            {hasCheckedPage
                ? sections.map((s, i) => (
                    <section key={i}>
                        <h2>{s.title}</h2>
                        {s.component}
                    </section>
                ))
                : null
            }
        </>
    );
}
