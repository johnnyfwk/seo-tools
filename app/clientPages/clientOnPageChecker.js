'use client';

import { useState } from "react";
import Url from "../components/url";
import StatusCode from "../components/statusCode";
import RedirectChain from "../components/redirectChain";
import RobotsTxt from "../components/robotsTxt";
import RobotsDisclaimer from "../components/robotsDisclaimer";
import MetaRobotsTag from "../components/metaRobotsTag";
import CanonicalTags from "../components/canonicalTags";
import HtmlLanguageAttribute from "../components/htmlLanguageAttribute";
import Viewport from "../components/viewport";
import MetaTitles from "../components/metaTitles";
import MetaDescriptions from "../components/metaDescriptions";

export default function ClientOnPageChecker() {
    const initialPageData = {
        scrapeDuration: null,
        enteredUrl: "",
        enteredUrlStatusCode: null,
        enteredUrlIsBlockedByRobots: null,
        finalUrl: "",
        redirects: [],
        robotsTxt: {
            blocked: null,
            determiningRule: {
                type: "",
                rule: [],
            },
            exists: null,
            sitemaps: [],
            url: "",
        },
        scrapedData: {
            metaRobotsTag: {
                allowsFollowing: null,
                allowsIndexing: null,
                content: "",
                htmlTagContent: "",
                xRobotsTagContent: "",
            },
            canonicalTags: {
                tags: [],
                globalIssues: [],
            },
            htmlLanguageAttribute: {
                attribute: "",
                isValid: null,
                issues: [],
            },
            viewport: {
                content: "",
                properties: {}
            },
            metaTitles: [],
            metaDescriptions: [],
        },
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

        const startTime = performance.now();

        try {
            const response = await fetch('/api/on-page-checker', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enteredUrl: validatedUrl.href,
                    scrapeEvenIfBlocked,
                }),
            });

            if (!response.ok) {
                setError(`Request failed: ${response.status}`);
                return;
            }

            const data = await response.json();
            console.log("Data:", data);

            const endTime = performance.now();
            const elapsedMs = endTime - startTime;

            setPageData({
                ...initialPageData,
                ...data,
                scrapeDuration: elapsedMs,
                enteredUrl: data.enteredUrl || "",
                enteredUrlStatusCode: data.enteredUrlStatusCode || null,
                enteredUrlIsBlockedByRobots: data.enteredUrlIsBlockedByRobots || null,
                finalUrl: data.finalUrl || "",
                redirects: data.redirects || [],
                robotsTxt: data.robotsTxt || {
                    blocked: data.robotsTxt?.blocked || null,
                    determiningRule: data.robotsTxt?.determiningRule || {
                        type: data.robotsTxt?.determiningRule?.type || "",
                        rule: data.robotsTxt?.determiningRule?.rule || []
                    },
                    exists: data.robotsTxt?.exists || null,
                    sitemaps: data.robotsTxt?.sitemaps || [],
                    url: data.robotsTxt?.url || ""
                },
                scrapedData:  data.scrapedData || {
                    metaRobotsTag: data.scrapedData?.metaRobotsTag || {
                        allowsFollowing: data.scrapedData?.allowsFollowing || null,
                        allowsIndexing: data.scrapedData?.allowsIndexing || null,
                        content: data.scrapedData?.content || "",
                        htmlTagContent: data.scrapedData?.htmlTagContent || "",
                        xRobotsTagContent: data.scrapedData?.xRobotsTagContent || ""
                    },
                    canonicalTags: data.scrapedData?.canonicalTags || {
                        tags: data.scrapedData?.canonicalTags?.tags || [],
                        globalIssues: data.scrapedData?.canonicalTags?.globalIssues || [],
                    },
                    htmlLanguageAttribute: data.scrapedData?.htmlLanguageAttribute || {
                        attribute: data.scrapedData?.htmlLanguageAttribute?.attribute || "",
                        isValid: data.scrapedData?.htmlLanguageAttribute?.isValid || null,
                        issues: data.scrapedData?.htmlLanguageAttribute?.issues || [],
                    },
                    viewport: data.scrapedData?.viewport || {
                        content: data.scrapedData?.viewport?.content || "",
                        properties: data.scrapedData?.viewport?.properties || {}
                    },
                    metaTtitles: data.scrapedData?.metaTitles || [],
                    metaDescriptions: data.scrapedData?.metaDescriptions || [],
                },
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

    const technicalSectionsAlwaysRender = [
        {
            title: "Scrape Duration",
            component: <p>{formatDuration(pageData.scrapeDuration)}</p>,
        },
        {
            title: "Entered URL",
            component: <Url url={pageData.enteredUrl} />,
        },
        {
            title: "Status Code",
            component: <StatusCode statusCode={pageData.enteredUrlStatusCode} />,
        },
        {
            title: "Robots.txt",
            component: <RobotsTxt robotsTxt={pageData.robotsTxt} />,
        },
    ];

    const technicalRedirectsSections = [
        {
            title: "Redirect URL",
            component: <Url url={pageData.redirects[1]?.url} />,
        },
        {
            title: "Final URL",
            component: <Url url={pageData.finalUrl} />,
        },
        {
            title: "Redirect Chain",
            component: <RedirectChain redirectChain={pageData.redirects} />,
        },
    ];

    const contentSections = [
        {
            title: "Meta Robots Tag",
            component: <MetaRobotsTag metaRobotsTag={pageData.scrapedData.metaRobotsTag} />,
        },
        {
            title: `Canonical Tags (${pageData.scrapedData.canonicalTags.tags.length})`,
            component: <CanonicalTags canonicalTags={pageData.scrapedData.canonicalTags} />
        },
        {
            title: "HTML Language Attribute",
            component: <HtmlLanguageAttribute htmlLanguageAttribute={pageData.scrapedData?.htmlLanguageAttribute} />
        },
        {
            title: "Viewport",
            component: <Viewport viewport={pageData.scrapedData.viewport} />
        },
        {
            title: `Meta Titles (${pageData.scrapedData.metaTitles.length})`,
            component: <MetaTitles metaTitles={pageData.scrapedData.metaTitles} />,
        },
        {
            title: `Meta Descriptions (${pageData.scrapedData.metaDescriptions.length})`,
            component: <MetaDescriptions metaDescriptions={pageData.scrapedData.metaDescriptions} />,
        },
    ];

    // console.log("Page Data:", pageData)

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

                        <RobotsDisclaimer
                            checked={scrapeEvenIfBlocked}
                            onChange={(value) => {
                                setScrapeEvenIfBlocked(value);
                                setHasCheckedPage(false); // reset until next fetch
                            }}
                        />

                        <button
                            type="submit"
                            disabled={isCheckingPage || !inputUrl.trim() || !!error}
                        >
                            {isCheckingPage ? "Fetching..." : "Check Page"}
                        </button>
                    </fieldset>
                </form>
            </section>

            {hasCheckedPage
                ? <>
                    {technicalSectionsAlwaysRender.map((s, i) => (
                        <section key={i}>
                            <h2>{s.title}</h2>
                            {s.component}
                        </section>
                    ))}

                    {pageData.redirects.length > 1
                        ? technicalRedirectsSections.map((s, i) => (
                            <section key={i}>
                                <h2>{s.title}</h2>
                                {s.component}
                            </section>
                        ))
                        : null
                    }

                    <section>
                        <h2>Page Data</h2>

                        {pageData.enteredUrlIsBlockedByRobots && !scrapeEvenIfBlocked
                            ? <p>Entered URL is blocked by robots.txt. Page data could not be fetched.</p>
                            : null
                        }

                        {pageData.enteredUrlIsBlockedByRobots && scrapeEvenIfBlocked
                            ? <>
                                <p>Entered URL is blocked by robots.txt. You have selected to ignore robots.txt.</p>
                                {contentSections.map((s, i) => (
                                    <div key={i}>
                                        <h3 style={{marginTop: "1rem", marginBottom: "0.5rem"}}>{s.title}</h3>
                                        {s.component}
                                    </div>
                                ))}
                            </>
                            : null
                        }

                        {!pageData.enteredUrlIsBlockedByRobots
                            ? <>
                                {pageData.robotsTxt.exists
                                    ? <p>Entered URL is allowed to be crawled by robots.txt. Page data has been fetched.</p>
                                    : <p>Robots.txt could not be found. Entered URL is allowed to be crawled by bots by default. Page data has been fetched.</p>
                                }
                                
                                {contentSections.map((s, i) => (
                                    <div key={i}>
                                        <h3 style={{marginTop: "1rem", marginBottom: "0.5rem"}}>{s.title}</h3>
                                        {s.component}
                                    </div>
                                ))}
                            </>
                            : null
                        }
                    </section>
                </>
                : null
            }
        </>
    );
}
