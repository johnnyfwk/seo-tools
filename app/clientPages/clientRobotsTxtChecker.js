'use client';

import { useState } from "react";
import InputUrl from "../components/inputUrl";
import Url from "../components/url";
import StatusCode from "../components/statusCode";
import RobotsTxt from "../components/robotsTxt";
import RedirectChain from "../components/redirectChain";
import * as utils from '@/app/lib/utils/utils';

export default function ClientRobotsTxtChecker({ metaDescription }) {
    const initialPageData = {
        scrapeDuration: null,
        enteredUrl: "",
        enteredUrlStatusCode: null,
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

        const {
            valid,
            url,
            error: validationError
        } = utils.validateUrlFrontend(inputUrl);

        if (!valid) {
            setError(validationError);
            return;
        }

        setIsCheckingPage(true);

        const startTime = performance.now();

        try {
            const response = await fetch('/api/robots-txt-checker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    enteredUrl: url,
                    scrapeEvenIfBlocked,
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => null);
                setError(err?.error || `Request failed: ${response.status}`);
                return;
            }

            const data = await response.json();
            console.log("Data:", data);

            const endTime = performance.now();
            const elapsedMs = endTime - startTime;

            setPageData({
                ...initialPageData,
                ...data,
                scrapeDuration: elapsedMs || initialPageData.scrapeDuration,
                enteredUrl: data.enteredUrl || initialPageData.enteredUrl,
                enteredUrlStatusCode: data.enteredUrlStatusCode || initialPageData.enteredUrlStatusCode,
                finalUrl: data.finalUrl || initialPageData.finalUrl,
                redirects: [
                    ...initialPageData.redirects,
                    ...(data.redirects || [])
                ],
                robotsTxt: {
                    ...initialPageData.robotsTxt,
                    ...data.robotsTxt,
                },
            });

            setHasCheckedPage(true);

        } catch (err) {
            console.error(err);
            setError("Something went wrong while fetching the page data.");
        } finally {
            setIsCheckingPage(false);
        }
    }

    const scrapeDuration = utils.formatScrapeDuration(pageData.scrapeDuration);

    const alwaysRender = [
        {
            title: "Scrape Duration",
            component: <p>{scrapeDuration}</p>,
        },
        {
            title: "URL",
            component: <Url url={pageData.enteredUrl} />,
        },
        {
            title: "Status Code",
            component: <StatusCode statusCode={pageData.enteredUrlStatusCode} />,
        },
    ];

    const redirectsSection = [
        {
            title: "Final URL",
            component: <Url url={pageData.finalUrl} />,
        },
        {
            title: "Redirect Chain",
            component: <RedirectChain redirectChain={pageData.redirects} />,
        },
    ];

    const robotsTxtSection = [
        {
            title: "Robots.txt",
            component: <RobotsTxt robotsTxt={pageData.robotsTxt} />,
        },
    ];

    function RenderSections({ sections }) {
         return sections.map((s, i) => (
            <section key={i}>
                <h2>{s.title}</h2>
                {s.component}
            </section>
        ));
    }

    return (
        <>
            <section>
                <h1>Free Robots.txt Checker</h1>

                <p>{metaDescription}</p>

                <InputUrl
                    inputUrl={inputUrl}
                    setInputUrl={setInputUrl}
                    scrapeEvenIfBlocked={scrapeEvenIfBlocked}
                    setScrapeEvenIfBlocked={setScrapeEvenIfBlocked}
                    handleCheckPage={handleCheckPage}
                    isCheckingPage={isCheckingPage}
                    setHasCheckedPage={setHasCheckedPage}
                    error={error}
                    setError={setError}
                    page="robots-txt-checker"
                />
            </section>
            
            {hasCheckedPage
                ? <>
                    <RenderSections sections={alwaysRender}/>

                    {pageData.redirects.length > 1
                        ? <RenderSections sections={redirectsSection}/>
                        : null
                    }

                    <RenderSections sections={robotsTxtSection}/>
                </>
                : null
            }
        </>
    )
}