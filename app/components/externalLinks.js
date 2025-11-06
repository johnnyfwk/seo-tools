import Link from "next/link";

export default function ExternalLinks({ externalLinks }) {
    if (externalLinks.length === 0) {
        return <p>No external links found.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>#</th>
                    <th style={{ textAlign: 'center' }}>Type</th>
                    <th style={{ textAlign: 'left' }}>Anchor</th>
                    <th style={{ textAlign: 'left' }}>Link URL</th>
                    <th style={{ textAlign: 'center' }}>Link URL Status Code</th>
                    <th style={{ textAlign: 'left' }}>Final URL</th>
                    <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
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

                        {/* Link URL */}
                        <td style={{ textAlign: 'left' }}>
                            <Link href={link.url || "#"} target="_blank">
                                {link.url}
                            </Link>
                        </td>

                        {/* Link URL Status Code */}
                        <td
                            style={{ textAlign: 'center' }}
                            className={link.statusCode === 200
                                ? "success-background"
                                : link.statusCode === null
                                    ? ""
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

                        {/* Final URL Status Code */}
                        <td
                            style={{ textAlign: 'center' }}
                            className={link.finalUrlStatusCode === 200
                                ? "success-background"
                                : link.finalUrlStatusCode === null
                                    ? ""
                                    : "error-background"
                            }
                        >
                            {link.finalUrlStatusCode || "N/A"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
