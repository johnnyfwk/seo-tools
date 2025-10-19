import Link from "next/link";

export default function ExternalLinks({ externalLinks }) {
    return (
        <section id="external-links">
            <h2>External Links ({externalLinks?.length || 0})</h2>

            {!externalLinks?.length ? (
                <p>No external links found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th style={{ textAlign: 'center' }}>Type</th>
                            <th style={{ textAlign: 'left' }}>Anchor</th>
                            <th style={{ textAlign: 'left' }}>Link URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {externalLinks.map((link, i) => (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>
                                    {i + 1}
                                </td>
                                {/* Type */}
                                <td style={{ textAlign: 'center' }}>
                                    {link.anchor?.type || "Text"}
                                </td>

                                {/* Anchor */}
                                <td style={{ textAlign: 'left' }}>
                                    {link.anchor?.type?.toLowerCase() === "image" ? (
                                        <img
                                            src={link.anchor.src}
                                            alt={link.anchor.alt || 'Image link'}
                                            style={{ maxHeight: "40px" }}
                                        />
                                    ) : (
                                        link.anchor?.text || "(no text)"
                                    )}
                                </td>

                                {/* URL */}
                                <td style={{ textAlign: 'left' }}>
                                    <Link href={link.url || "#"} target="_blank">
                                        {link.url}
                                    </Link>
                                </td>

                                {/* Status Code */}
                                <td
                                    style={{ textAlign: 'center' }}
                                    className={link.statusCode === 200
                                        ? "success-background"
                                        : "error-background"
                                    }
                                >
                                    {link.statusCode || "N/A"}
                                </td>

                                {/* Final URL */}
                                <td style={{ textAlign: 'left' }}>
                                    <Link href={link.finalUrl || "#"} target="_blank">
                                        {link.finalUrl}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}
