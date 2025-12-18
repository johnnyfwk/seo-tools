import * as utils from '@/app/lib/utils/utils';

export default function Links({ links }) {
    const crawlableLinks = links.filter((link) => {
        return !link.uncrawlable;
    })

    if (crawlableLinks.length === 0) {
        return <p>⚠️ No links found</p>;
    }

    const issues = [];

    const nullStatusCodeLinks = crawlableLinks.filter((link) => link.initialUrlStatusCode === null);
    const non200Links = crawlableLinks.filter((link) => link.initialUrlStatusCode !== null && link.initialUrlStatusCode !== 200);
    const nofollowInternalLinks = crawlableLinks.filter((link) => link.internal === true && link.nofollow === true);
    const noopenerInternalLinks = crawlableLinks.filter((link) => link.internal === true && link.noopener === true);
    const noreferrerInternalLinks = crawlableLinks.filter((link) => link.internal === true && link.noreferrer === true);

    if (nullStatusCodeLinks.length > 0) {
        if (nullStatusCodeLinks.length === 1) {
            issues.push(`1 link status code could not be fetched`);
        } else if (nullStatusCodeLinks.length > 1) {
            issues.push(`${nullStatusCodeLinks.length} link status codes could not be fetched`);
        }
    }

    if (non200Links.length > 0) {
        if (non200Links.length === 1) {
            issues.push(`1 link returns a non-200 status code`);
        } else if (non200Links.length > 1) {
            issues.push(`${non200Links.length} links return a non-200 status code`);
        }
    }

    if (nofollowInternalLinks.length > 0) {
        if (nofollowInternalLinks.length === 1) {
            issues.push(`1 link has a 'nofollow' attribute value`);
        } else if (nofollowInternalLinks.length > 1) {
            issues.push(`${nofollowInternalLinks.length} links have a 'nofollow' attribute value`);
        }
    }

    if (noopenerInternalLinks.length > 0) {
        if (noopenerInternalLinks.length === 1) {
            issues.push(`1 link has a 'noopener' attribute value`);
        } else if (noopenerInternalLinks.length > 1) {
            issues.push(`${noopenerInternalLinks.length} links have a 'noopener' attribute value`);
        }
    }

    if (noreferrerInternalLinks.length > 0) {
        if (noreferrerInternalLinks.length === 1) {
            issues.push(`1 link has a 'noreferrer' attribute value`);
        } else if (noreferrerInternalLinks.length > 1) {
            issues.push(`${noreferrerInternalLinks.length} links have a 'noreferrer' attribute value`);
        }
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Potential issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return <li key={i}>{issue}</li>
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found</p>
            }

            <div className="table-wrapper">
                <table style={{ width: "max-content" }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th style={{ textAlign: 'center' }}>Link Type</th>
                            <th style={{ textAlign: 'left' }}>Anchor Text</th>
                            <th style={{ textAlign: 'center' }}>Image</th>
                            <th style={{ textAlign: 'center' }}>Nofollow?</th>
                            <th style={{ textAlign: 'center' }}>Noopener?</th>
                            <th style={{ textAlign: 'center' }}>Noreferrer?</th>
                            <th style={{ textAlign: 'center' }}>Sponsored?</th>
                            <th style={{ textAlign: 'center' }}>User-Generated Content?</th>
                            <th style={{ textAlign: 'left' }}>Href</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                            <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crawlableLinks.map((link, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ textAlign: 'center' }}>{i + 1}</td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={link.type.toLowerCase() === "uncrawlable"
                                            ? "warning-background"
                                            : ""
                                        }
                                    >{link.type}</td>

                                    <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(link.anchorText) || "(no text)"}</td>

                                    <td style={{ textAlign: 'left' }}>
                                        {link.imageSrc
                                            ? <a
                                                href={link.imageSrc}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="component-links"
                                            >
                                                <img
                                                    src={link.imageSrc}
                                                    alt={link.imageSrc || "Internal link image"}
                                                    style={{ maxHeight: "60px" }}
                                                />
                                            </a>
                                            : "-"
                                        }
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={link.internal === true && link.nofollow
                                            ? "warning-background"
                                            : link.internal === false && link.nofollow
                                                ? "neutral-background"
                                                : ""
                                        }
                                    >
                                        {link.nofollow === true ? "Yes" : "No"}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={link.internal === true && link.noopener
                                            ? "warning-background"
                                            : link.internal === false && link.noopener
                                                ? "neutral-background"
                                                : ""
                                        }
                                    >
                                        {link.noopener === true ? "Yes" : "No"}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={link.internal === true && link.noreferrer
                                            ? "warning-background"
                                            : link.internal === false && link.noreferrer
                                                ? "neutral-background"
                                                : ""
                                        }
                                    >
                                        {link.noreferrer === true ? "Yes" : "No"}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={link.sponsored
                                            ? "neutral-background"
                                            : ""
                                        }
                                    >
                                        {link.sponsored === true ? "Yes" : "No"}
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={link.ugc
                                            ? "neutral-background"
                                            : ""
                                        }
                                    >
                                        {link.ugc === true ? "Yes" : "No"}
                                    </td>

                                    <td style={{ textAlign: 'left' }}>
                                        <a
                                            href={link.initialUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="component-links"
                                        >
                                            {link.rawHref}
                                        </a>
                                    </td>

                                    <td
                                        style={{ textAlign: "center" }}
                                        className={utils.getInitialUrlStatusCodeClass(link.initialUrlStatusCode)}
                                    >
                                        {link.initialUrlStatusCode || "N/A"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {link.initialUrlStatusCode >= 300 && link.initialUrlStatusCode < 400
                                            ? link.finalUrl
                                                ? <a
                                                    href={link.finalUrl}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="component-links"
                                                >
                                                    {link.finalUrl}
                                                </a>
                                                : "N/A"
                                            : "-"
                                        }
                                    </td>

                                    <td
                                        style={{ textAlign: "center" }}
                                        className={utils.getFinalUrlStatusCodeTextAndClass(
                                            link.initialUrlStatusCode,
                                            link.finalUrlStatusCode
                                        ).class}
                                    >
                                        {utils.getFinalUrlStatusCodeTextAndClass(
                                            link.initialUrlStatusCode,
                                            link.finalUrlStatusCode
                                        ).text}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}