'use client';

import { useState } from "react";
import Url from "../components/url";
import StatusCode from "../components/statusCode";
import RedirectChain from "../components/redirectChain";
import RobotsTxt from "../components/robotsTxt";

export default function ClientOnPageChecker() {
    const initialPageData = {
        scrapeDuration: null,
        enteredUrl: "",
        enteredUrlStatusCode: null,
        finalUrl: "",
        redirects: [],
        robotsTxt: {},
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
                    scrapeEvenIfBlocked
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
                finalUrl: data.finalUrl || "",
                redirects: data.redirects || [],
                robotsTxt: data.robotsTxt || {},
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
        pageData.scrapeDuration
            ? {
                title: "Scrape Duration",
                component: <p>{formatDuration(pageData.scrapeDuration)}</p>,
            }
            : null,

        pageData.enteredUrl
            ? {
                title: "Entered URL",
                component: <Url url={pageData.enteredUrl} />,
            }
            : null,

        pageData.enteredUrlStatusCode
            ? {
                title: "Status Code",
                component: <StatusCode statusCode={pageData.enteredUrlStatusCode} />,
            }
            : null,

        pageData.enteredUrlStatusCode >= 300 &&
        pageData.enteredUrlStatusCode < 400 &&
        pageData.redirects.length > 1
            ? {
                title: "Redirect URL",
                component: <Url url={pageData.redirects[1].url} />,
            }
            : null,

        pageData.enteredUrlStatusCode >= 300 &&
        pageData.enteredUrlStatusCode < 400 &&
        pageData.redirects.length > 2
            ? {
                title: "Final URL",
                component: <Url url={pageData.finalUrl} />,
            }
            : null,

        pageData.enteredUrlStatusCode >= 300 &&
        pageData.enteredUrlStatusCode < 400 &&
        pageData.redirects.length > 0
            ? {
                title: "Redirect Chain",
                component: <RedirectChain redirectChain={pageData.redirects} />,
            }
            : null,

        pageData.robotsTxt
            ? {
                title: "Robots.txt",
                component: <RobotsTxt robotsTxt={pageData.robotsTxt} />,
            }
            : null,
    ];

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
                            disabled={isCheckingPage || !inputUrl.trim() || !!error}
                        >
                            {isCheckingPage ? "Fetching..." : "Check Page"}
                        </button>
                    </fieldset>
                </form>
            </section>

            {hasCheckedPage
                ? sections.filter(Boolean).map((s, i) => (
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
