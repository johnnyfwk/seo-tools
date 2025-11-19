import Link from "next/link";

export default function Links({ links }) {
    if (links.length === 0) {
        return <p>No links found.</p>;
    }

    function getStatusClass(code) {
        if (!code) return "error-background"; // failed or null
        if (code >= 200 && code < 300) return "success-background";
        if (code >= 300 && code < 400) return "warning-background";
        return "error-background"; // 400/500
    }

    function getFinalStatus(link) {
        const final = link.finalStatusCode;

        // No redirect → hide final info
        if (link.statusCode >= 200 && link.statusCode < 300) {
            return { text: "-", class: "" };
        }

        // No final status → fetch error
        if (!final) {
            return { text: "-", class: "error-background" };
        }

        // Good final
        if (final >= 200 && final < 300) {
            return { text: final, class: "success-background" };
        }

        // Redirect
        if (final >= 300 && final < 400) {
            return { text: final, class: "warning-background" };
        }

        // Error
        return { text: final, class: "error-background" };
    }

    return (
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
                {links.map((link, i) => {
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

                            <td style={{ textAlign: 'left' }}>{link.anchorText || "(no text)"}</td>

                            <td style={{ textAlign: 'center' }}>
                                {link.imageSrc
                                    ? <Link
                                        href={link.imageSrc}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        <img
                                            src={link.imageSrc}
                                            alt={link.imageSrc || "Internal link image"}
                                            style={{ maxHeight: "100px" }}
                                        />
                                    </Link>
                                    : "-"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={link.internal && link.nofollow
                                    ? "warning-background"
                                    : ""
                                }
                            >
                                {link.nofollow ? "Yes" : "No"}
                            </td>

                            <td style={{ textAlign: 'center' }}>
                                {link.noopener ? "Yes" : "No"}
                            </td>

                            <td style={{ textAlign: 'center' }}>
                                {link.noreferrer ? "Yes" : "No"}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={link.internal && link.sponsored
                                    ? "error-background"
                                    : ""
                                }
                            >
                                {link.sponsored ? "Yes" : "No"}
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={link.internal && link.ugc
                                    ? "warning-background"
                                    : ""
                                }
                            >
                                {link.ugc ? "Yes" : "No"}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                <Link
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {link.rawHref}
                                </Link>
                            </td>

                            <td
                                style={{ textAlign: "center" }}
                                className={getStatusClass(link.statusCode)}
                            >
                                {link.statusCode || "-"}
                            </td>

                            <td style={{ textAlign: "left" }}>
                                {link.statusCode >= 200 && link.statusCode < 300
                                    ? "-"
                                    : link.finalUrl
                                        ? <Link
                                            href={link.finalUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            {link.finalUrl}
                                        </Link>
                                        : "-"
                                }
                            </td>

                            <td
                                style={{ textAlign: "center" }}
                                className={getFinalStatus(link).class}
                            >
                                {getFinalStatus(link).text}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}