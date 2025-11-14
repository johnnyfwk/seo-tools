import Link from "next/link";

export default function Links({ links }) {
    if (links.length === 0) {
        return <p>No links found.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>#</th>
                    <th style={{ textAlign: 'center' }}>Link Type</th>
                    <th style={{ textAlign: 'left' }}>Anchor Text / Image</th>
                    <th style={{ textAlign: 'left' }}>URL</th>
                    <th style={{ textAlign: 'center' }}>Status Code</th>
                    <th style={{ textAlign: 'left' }}>Final URL</th>
                    <th style={{ textAlign: 'left' }}>Final URL Status Code</th>
                </tr>
            </thead>
            <tbody>
                {links.map((link, i) => (
                    <tr key={i}>
                        <td style={{ textAlign: 'center' }}>{i + 1}</td>

                        <td style={{ textAlign: 'center' }}>{link.type}</td>

                        <td style={{ textAlign: 'left' }}>
                            {link.type.toLowerCase() === "text"
                                ? link.anchorText || "(no text)"
                                : link.type.toLowerCase() === "image"
                                    ? <img
                                        src={link.imageSrc}
                                        alt={link.imageSrc || "Internal link image"}
                                        style={{ maxHeight: "40px" }}
                                    />
                                    : "-"
                            }
                        </td>

                        <td style={{ textAlign: 'left' }}>
                            <Link
                                href={link.url}
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                {link.url}
                            </Link>
                        </td>

                        <td
                            style={{ textAlign: 'center' }}
                            className={link.statusCode === null
                                ? ""
                                : link.statusCode === 200
                                    ? "success-background"
                                    : "error-background"
                            }
                        >{link.statusCode || "-"}</td>

                        <td>
                            {link.statusCode === 200
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
                            className={link.statusCode === 200 || link.finalStatusCode === null
                                ? ""
                                : link.finalStatusCode === 200
                                    ? "success-background"
                                    : "error-background"
                            }
                        >
                            {link.statusCode === 200
                                ? "-"
                                : link.finalStatusCode
                                    ? link.finalStatusCode
                                    : "-"
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}