import * as utils from '@/app/lib/utils/utils';

export default function Links({ links }) {
    const crawlableLinks = links.filter((link) => {
        return !link.uncrawlable;
    })

    if (crawlableLinks.length === 0) {
        return <p>No links found.</p>;
    }

    const issues = [];

    const nofollowLinks = crawlableLinks.filter((link) => link.internal === true && link.nofollow);
    const non200Links = crawlableLinks.filter((link) => link.initialUrlStatusCode !== 200);

    if (nofollowLinks.length > 0) {
        issues.push(`${nofollowLinks.length} links have a 'nofollow' attribute value`);
    }

    if (non200Links.length > 0) {
        issues.push(`${non200Links.length} links return a non-200 status code`);
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
                : <p>✅ No issues found.</p>
            }

            <table>
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

                                <td style={{ textAlign: 'center' }}>
                                    {link.imageSrc
                                        ? <a
                                            href={link.imageSrc}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            <img
                                                src={link.imageSrc}
                                                alt={link.imageSrc || "Internal link image"}
                                                style={{ maxHeight: "70px" }}
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
    )
}