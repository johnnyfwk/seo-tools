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
import Headings from "../components/headings";
import Links from "../components/links";
import Images from "../components/images";
import SchemaMarkup from "../components/schemaMarkup";
import Hreflang from "../components/hreflang";
import OpenGraph from "../components/openGraph";
import Pagination from "../components/pagination";
import XmlSitemaps from "../components/xmlSitemaps";
import HttpRedirectsToHttps from "../components/httpRedirectsToHttps";
import * as utils from '@/app/lib/utils/utils';
import Indexability from "../components/indexability";
import ContentType from "../components/contentType";

export default function ClientOnPageChecker() {
    const initialPageData = {
        scrapeDuration: null,
        enteredUrl: "",
        indexability: {
            indexable: null,
            reasons: [],
        },
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
        xmlSitemaps: {
            hasSitemap: null,
            message: "",
            robotsTxtChecked: "",
            sitemapsChecked: [],
            sitemapsContainingUrl: [],
            urlFound: null,
        },
        headers: {},
        contentType: "",
        isHtml: null,
        isImage: null,
        isPdf: null,
        isCss: null,
        isJs: null,
        isOther: null,
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
            headings: [],
            links: {
                internal: [],
                external: [],
                uncrawlable: [],
            },
            images: [],
            schemaMarkup: [],
            hreflang: [],
            openGraph: {},
            pagination: [],
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

            const urlIndexability = utils.evaluateIndexability({
                statusCode: data.enteredUrlStatusCode,
                blockedByRobots: data.robotsTxt?.blocked,
                canonicalMatches: data.scrapedData?.canonicalTags?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl,
                metaRobotsAllowsIndexing: data.scrapedData?.metaRobotsTag?.allowsIndexing,
                contentType: data.contentType,
                xRobotsNoindex: data.headers?.["x-robots-tag"] || data.headers?.["X-Robots-Tag"] || "",
            });

            setPageData({
                ...initialPageData,
                ...data,
                scrapeDuration: elapsedMs || initialPageData.scrapeDuration,
                enteredUrl: data.enteredUrl || initialPageData.enteredUrl,
                indexability: urlIndexability || initialPageData.indexability,
                enteredUrlStatusCode: data.enteredUrlStatusCode || initialPageData.enteredUrlStatusCode,
                enteredUrlIsBlockedByRobots: data.enteredUrlIsBlockedByRobots || initialPageData.enteredUrlIsBlockedByRobots,
                finalUrl: data.finalUrl || initialPageData.finalUrl,
                redirects: [
                    ...initialPageData.redirects,
                    ...(data.redirects || [])
                ],
                robotsTxt: {
                    ...initialPageData.robotsTxt,
                    ...data.robotsTxt,
                },
                xmlSitemaps: {
                    ...initialPageData.xmlSitemaps,
                    ...data.xmlSitemaps
                },
                headers: data.headers || {},
                contentType: data.contentType || "",
                isHtml: data.isHtml || null,
                isImage: data.isImage || null,
                isPdf: data.isPdf || null,
                isCss: data.isCss || null,
                isJs: data.isJs || null,
                isOther: data.isOther || null,
                scrapedData: {
                    ...initialPageData.scrapedData,
                    ...data.scrapedData,
                    metaRobotsTag: {
                        ...initialPageData.scrapedData.metaRobotsTag,
                        ...data.scrapedData?.metaRobotsTag
                    },
                    canonicalTags: {
                        ...initialPageData.scrapedData.canonicalTags,
                        ...data.scrapedData?.canonicalTags,
                    },
                    htmlLanguageAttribute: {
                        ...initialPageData.scrapedData.htmlLanguageAttribute,
                        ...data.scrapedData?.htmlLanguageAttribute
                    },
                    viewport: {
                        ...initialPageData.scrapedData.viewport,
                        ...data.scrapedData?.viewport
                    },
                    metaTitles: [
                        ...initialPageData.scrapedData.metaTitles,
                        ...(data.scrapedData?.metaTitles || [])
                    ],
                    metaDescriptions: [
                        ...initialPageData.scrapedData.metaDescriptions,
                        ...(data.scrapedData?.metaDescriptions || [])
                    ],
                    headings: [
                        ...initialPageData.scrapedData.headings,
                        ...(data.scrapedData?.headings || [])
                    ],
                    links: {
                        ...initialPageData.scrapedData.links,
                        ...data.scrapedData?.links
                    },
                    images: [
                        ...initialPageData.scrapedData.images,
                        ...(data.scrapedData?.images || [])
                    ],
                    schemaMarkup: [
                        ...initialPageData.scrapedData.schemaMarkup,
                        ...(data.scrapedData?.schemaMarkup || [])
                    ],
                    hreflang: [
                        ...initialPageData.scrapedData.hreflang,
                        ...(data.scrapedData?.hreflang || [])
                    ],
                    openGraph: {
                        ...initialPageData.scrapedData.openGraph,
                        ...data.scrapedData?.openGraph
                    },
                    pagination: [
                        ...initialPageData.scrapedData.pagination,
                        ...(data.scrapedData?.pagination || [])
                    ],
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
            title: "Content Type",
            component: <ContentType
                contentType={pageData.contentType}
                isHtml={pageData.isHtml}
                isPdf={pageData.isPdf}
                isImage={pageData.isImage}
                isCss={pageData.isCss}
                isJs={pageData.isJs}
                isOther={pageData.isOther}
            />
        },
        {
            title: "Indexability",
            component: <Indexability indexability={pageData.indexability} />,
        },
        {
            title: "Status Code",
            component: <StatusCode statusCode={pageData.enteredUrlStatusCode} />,
        },
        {
            title: "Robots.txt",
            component: <RobotsTxt robotsTxt={pageData.robotsTxt} />,
        },
                {
            title: `XML Sitemaps`,
            component: <XmlSitemaps xmlSitemaps={pageData.xmlSitemaps} />,
        },
    ];

    const technicalRedirectsSections = [
        {
            title: "Redirect URL",
            component: <Url url={pageData.redirects[1]?.url} />,
        },
                {
            title: "HTTP -> HTTPS",
            component: <HttpRedirectsToHttps redirectChain={pageData.redirects} />,
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
        {
            title: "Headings",
            component: <Headings headings={pageData.scrapedData.headings} />,
        },
        {
            title: `Internal Links (${pageData.scrapedData.links.internal.length})`,
            component: <Links links={pageData.scrapedData.links.internal} />,
        },
        {
            title: `External Links (${pageData.scrapedData.links.external.length})`,
            component: <Links links={pageData.scrapedData.links.external} />,
        },
        {
            title: `Images (${pageData.scrapedData.images.length})`,
            component: <Images images={pageData.scrapedData.images} />,
        },
        {
            title: `Schema Markup (${pageData.scrapedData.schemaMarkup.length})`,
            component: <SchemaMarkup schemaMarkup={pageData.scrapedData.schemaMarkup} />,
        },
        {
            title: `Hreflang (${pageData.scrapedData.hreflang.length})`,
            component: <Hreflang hreflang={pageData.scrapedData.hreflang} />,
        },
        {
            title: `Open Graph`,
            component: <OpenGraph openGraph={pageData.scrapedData.openGraph} />,
        },
        {
            title: `Pagination (${pageData.scrapedData.pagination.length})`,
            component: <Pagination pagination={pageData.scrapedData.pagination} />,
        },
    ];

    // console.log("Page Data:", pageData)

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
                    <RenderSections sections={technicalSectionsAlwaysRender}/>

                    {pageData.redirects.length > 1
                        ? <RenderSections sections={technicalRedirectsSections}/>
                        : null
                    }

                    {pageData.enteredUrlIsBlockedByRobots && !scrapeEvenIfBlocked
                        ? <section>
                            <h2>Page Data</h2>
                            <p>Entered URL is blocked by robots.txt. Page data could not be fetched.</p>
                        </section>
                        : pageData.isHtml
                            ? <RenderSections sections={contentSections}/>
                            : <section>
                                <h2>Page Data</h2>
                                <p>No HTML found.</p>
                            </section>
                    }
                </>
                : null
            }
        </>
    );
}
