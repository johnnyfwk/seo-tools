'use client';

import { useState } from "react";
import InputUrl from "../components/inputUrl";
import Url from "../components/url";
import ContentType from "../components/contentType";
import Indexability from "../components/indexability";
import StatusCode from "../components/statusCode";
import HttpRedirectsToHttps from "../components/httpRedirectsToHttps";
import RedirectChain from "../components/redirectChain";
import RobotsTxt from "../components/robotsTxt";
import XmlSitemaps from "../components/xmlSitemaps";
import MetaRobotsAndXRobotsTag from "../components/metaRobotsAndXRobotsTag";
import CanonicalTags from "../components/canonicalTags";
import HtmlLanguageAttribute from "../components/htmlLanguageAttribute";
import Viewport from "../components/viewport";
import TitleTags from "../components/titleTags";
import MetaDescriptions from "../components/metaDescriptions";
import Headings from "../components/headings";
import Links from "../components/links";
import Images from "../components/images";
import StructuredData from "../components/structuredData";
import Hreflang from "../components/hreflang";
import OpenGraph from "../components/openGraph";
import Pagination from "../components/pagination";
import * as utils from '@/app/lib/utils/utils';

export default function ClientSeoOnPageChecker({ h1, metaDescription, scrapeOptions }) {
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
        indexability: {
            indexable: null,
            reasons: [],
        },
        xmlSitemaps: {
            hasSitemap: null,
            message: "",
            robotsTxtChecked: "",
            sitemapsChecked: [],
            sitemapsContainingUrl: [],
            urlFound: null,
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
            metaRobotsAndXRobotsTag: {
                allDirectives: "",
                metaRobotsTagContent: "",
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
            titleTags: [],
            metaDescriptions: [],
            headings: [],
            links: {
                internal: [],
                external: [],
                uncrawlable: [],
            },
            images: [],
            structuredData: [],
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
            const response = await fetch('/api/seo-on-page-checker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enteredUrl: url,
                    scrapeEvenIfBlocked,
                    scrapeOptions,
                }),
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

            const metaRobotsAllDirectivesLowercase = String(data.scrapedData?.metaRobotsAndXRobotsTag?.allDirectives || "").toLowerCase();

            const urlIndexability = utils.evaluateIndexability({
                statusCode: data.enteredUrlStatusCode,
                blockedByRobots: data.robotsTxt?.blocked,
                canonicalMatches: data.scrapedData?.canonicalTags?.tags?.[0]?.resolvedCanonicalUrlMatchesOriginalUrl,
                metaRobotsAllowsIndexing: !metaRobotsAllDirectivesLowercase.includes("noindex"),
                contentType: data.resource.contentType,
                xRobotsNoindex: data.resource.headers?.["x-robots-tag"] ||
                    data.resource.headers?.["X-Robots-Tag"] || "",
            });

            setPageData({
                ...initialPageData,
                ...data,
                scrapeDuration: elapsedMs || initialPageData.scrapeDuration,
                enteredUrl: data.enteredUrl || initialPageData.enteredUrl,
                indexability: urlIndexability || initialPageData.indexability,
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
                xmlSitemaps: {
                    ...initialPageData.xmlSitemaps,
                    ...data.xmlSitemaps,
                },
                resource: {
                    ...initialPageData.resource,
                    ...data.resource,
                },
                scrapedData: {
                    ...initialPageData.scrapedData,
                    ...data.scrapedData,
                    metaRobotsAndXRobotsTag: {
                        ...initialPageData.scrapedData.metaRobotsAndXRobotsTag,
                        ...data.scrapedData?.metaRobotsAndXRobotsTag
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
                    titleTags: [
                        ...initialPageData.scrapedData.titleTags,
                        ...(data.scrapedData?.titleTags || [])
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
                    structuredData: [
                        ...initialPageData.scrapedData.structuredData,
                        ...(data.scrapedData?.structuredData || [])
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

            setHasCheckedPage(true);

        } catch (err) {
            console.error(err);
            setError("Something went wrong while fetching the page data.");
        } finally {
            setIsCheckingPage(false);
        }
    }

    const scrapeDuration = utils.formatScrapeDuration(pageData.scrapeDuration);

    const mainSections = [
        {
            title: "Scrape Duration",
            component: <p>{scrapeDuration}</p>,
        },
        {
            title: "URL",
            component: <Url url={pageData.enteredUrl} />,
        },
        {
            title: "Indexability",
            component: <Indexability indexability={pageData.indexability} />,
        },
        {
            title: "Content Type",
            component: <ContentType
                contentType={pageData.resource?.contentType}
                isHtml={pageData.resource?.isHtml}
                isPdf={pageData.resource?.isPdf}
                isImage={pageData.resource?.isImage}
                isCss={pageData.resource?.isCss}
                isJs={pageData.resource?.isJs}
                isOther={pageData.resource?.isOther}
            />
        },
        {
            title: "Status Code",
            component: <StatusCode statusCode={pageData.enteredUrlStatusCode} />,
        },
    ];

    const redirectsSections = [
        {
            title: "HTTP -> HTTPS",
            component: <HttpRedirectsToHttps redirectChain={pageData.redirects} />,
        },
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

    const contentSections = {
        robotsTxt: {
            title: "Robots.txt",
            component: <RobotsTxt robotsTxt={pageData.robotsTxt} />,
        },
        xmlSitemaps: {
            title: `XML Sitemaps`,
            component: <XmlSitemaps xmlSitemaps={pageData.xmlSitemaps} />,
        },
        metaRobotsAndXRobotsTag: {
            title: "Meta Robots & X-Robots Tag",
            component: <MetaRobotsAndXRobotsTag metaRobotsAndXRobotsTag={pageData.scrapedData?.metaRobotsAndXRobotsTag} />,
        },
        canonicalTags: {
            title: `Canonical Tags (${pageData.scrapedData?.canonicalTags?.tags?.length})`,
            component: <CanonicalTags canonicalTags={pageData.scrapedData?.canonicalTags} />
        },
        htmlLanguageAttribute: {
            title: "HTML Language Attribute",
            component: <HtmlLanguageAttribute htmlLanguageAttribute={pageData.scrapedData?.htmlLanguageAttribute} />
        },
        viewport: {
            title: "Viewport Meta Tag",
            component: <Viewport viewport={pageData.scrapedData?.viewport} />
        },
        titleTags: {
            title: `Title Tags (${pageData.scrapedData?.titleTags?.length})`,
            component: <TitleTags titleTags={pageData.scrapedData?.titleTags} />,
        },
        metaDescriptions: {
            title: `Meta Descriptions (${pageData.scrapedData?.metaDescriptions?.length})`,
            component: <MetaDescriptions metaDescriptions={pageData.scrapedData?.metaDescriptions} />,
        },
        headings: {
            title: "H1 Tag & Heading Structure",
            component: <Headings headings={pageData.scrapedData?.headings} />,
        },
        internalLinks: {
            title: `Internal Links (${pageData.scrapedData?.links?.internal?.length})`,
            component: <Links links={pageData.scrapedData?.links?.internal} />,
        },
        externalLinks: {
            title: `External Links (${pageData.scrapedData?.links?.external?.length})`,
            component: <Links links={pageData.scrapedData?.links?.external} />,
        },
        images: {
            title: `Images (${pageData.scrapedData?.images?.length})`,
            component: <Images images={pageData.scrapedData?.images} />,
        },
        structuredData: {
            title: `Structured Data (${pageData.scrapedData?.structuredData?.length})`,
            component: <StructuredData structuredData={pageData.scrapedData?.structuredData} />,
        },
        hreflang: {
            title: `Hreflang Tags (${pageData.scrapedData?.hreflang?.length})`,
            component: <Hreflang
                hreflang={pageData.scrapedData?.hreflang}
                contentType={pageData.resource?.contentType}
                xRobotsNoindex={pageData.resource?.headers?.["x-robots-tag"] ||
                    pageData.resource?.headers?.["X-Robots-Tag"] ||
                    ""
                }
            />,
        },
        openGraph: {
            title: `Open Graph`,
            component: <OpenGraph
                openGraph={pageData.scrapedData?.openGraph}
                contentType={pageData.resource?.contentType}
                xRobotsNoindex={pageData.resource?.headers?.["x-robots-tag"] ||
                    pageData.resource?.headers?.["X-Robots-Tag"] ||
                    ""
                }
            />,
        },
        pagination: {
            title: `Pagination (${pageData.scrapedData?.pagination?.length})`,
            component: <Pagination pagination={pageData.scrapedData?.pagination} />,
        },
    };

    let contentSectionsToRender;

    contentSectionsToRender = Object.entries(scrapeOptions)
        .filter(([key, value]) => value === true && key !== 'all')
        .flatMap(([key]) => {
            if (key === "links") {
                return [
                    contentSections.internalLinks,
                    contentSections.externalLinks
                ];
            }
            return contentSections[key] ? [contentSections[key]] : [];
        });

    if (scrapeOptions.all) {
        contentSectionsToRender = Object.values(contentSections);
    }

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
                <h1>Free {h1}</h1>

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
                    <RenderSections sections={mainSections}/>

                    {pageData.redirects.length > 1
                        ? <RenderSections sections={redirectsSections}/>
                        : null
                    }

                    {pageData.robotsTxt.blocked && !scrapeEvenIfBlocked
                        ? <section>
                            <h2>Page Data</h2>
                            <p>Page data could not be fetched as the URL is blocked by robots.txt.</p>
                        </section>
                        : pageData.resource.isHtml
                            ? <RenderSections sections={contentSectionsToRender}/>
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
