'use client';

import { useState } from "react";
import InputUrl from "../components/inputUrl";
import Url from "../components/url";
import ContentType from "../components/contentType";
import StatusCode from "../components/statusCode";
import RedirectChain from "../components/redirectChain";
import TitleTags from "../components/titleTags";
import MetaDescriptions from "../components/metaDescriptions";
import * as utils from '@/app/lib/utils/utils';

export default function ClientTitleTagAndMetaDescriptionChecker({ metaDescription }) {
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
        resource: {
            exists: null,
            headers: {},
            contentType: null,
            isHtml: null,
            isPdf: null,
            isImage: null,
            isCss: null,
            isJs: null,
            isOther: null,
            data: null,
        },
        scrapedData: {
            titleTags: [],
            metaDescriptions: [],
        }
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
            const response = await fetch('/api/title-tag-and-meta-description-checker', {
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
                resource: {
                    ...initialPageData.resource,
                    ...data.resource,
                },
                scrapedData: {
                    ...initialPageData.scrapedData,
                    ...data.scrapedData,
                    titleTags: [
                        ...initialPageData.scrapedData.titleTags,
                        ...(data.scrapedData?.titleTags || [])
                    ],
                    metaDescriptions: [
                        ...initialPageData.scrapedData.metaDescriptions,
                        ...(data.scrapedData?.metaDescriptions || [])
                    ],
                }
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
            title: "Content Type",
            component: <ContentType
                contentType={pageData.resource.contentType}
                isHtml={pageData.resource.isHtml}
                isPdf={pageData.resource.isPdf}
                isImage={pageData.resource.isImage}
                isCss={pageData.resource.isCss}
                isJs={pageData.resource.isJs}
                isOther={pageData.resource.isOther}
            />
        },
        {
            title: "Status Code",
            component: <StatusCode statusCode={pageData.enteredUrlStatusCode} />,
        },
    ];

    const redirectsSections = [
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
            title: `Title Tags (${pageData.scrapedData?.titleTags?.length})`,
            component: <TitleTags titleTags={pageData.scrapedData?.titleTags} />,
        },
        {
            title: `Meta Descriptions (${pageData.scrapedData?.metaDescriptions?.length})`,
            component: <MetaDescriptions metaDescriptions={pageData.scrapedData?.metaDescriptions} />,
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
                <h1>Free Title Tag & Meta Description Length Checker</h1>

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
                />
            </section>
            
            {hasCheckedPage
                ? <>
                    <RenderSections sections={alwaysRender}/>

                    {pageData.redirects.length > 1
                        ? <RenderSections sections={redirectsSections}/>
                        : null
                    }

                    {pageData.robotsTxt.blocked && !scrapeEvenIfBlocked
                        ? <section>
                            <h2>Page Data</h2>
                            <p>URL is blocked by robots.txt. Title tag and meta description data could not be fetched.</p>
                        </section>
                        : pageData.resource.isHtml
                            ? <RenderSections sections={contentSections}/>
                            : <section>
                                <h2>Page Data</h2>
                                <p>No title tag or meta description data found.</p>
                            </section>
                    }
                </>
                : null
            }
        </>
    )
}