import Link from "next/link";

export default function ExternalLinks({ externalLinks }) {
    return (
        <section id="external-links">
            <h2>External Links ({externalLinks.length})</h2>

            {externalLinks.length
                ? <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th style={{ textAlign: 'left' }}>Anchor Text</th>
                            <th style={{ textAlign: 'left' }}>Link URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                            <th style={{ textAlign: 'left' }}>Redirect Chain</th>
                        </tr>
                    </thead>
                    <tbody>
                        {externalLinks.map((link, i) => (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                <td>
                                    {link.anchor?.type === 'image' ? (
                                        <img 
                                            src={link.anchor.src} 
                                            alt={link.anchor.alt || 'Image link'} 
                                            style={{ minWidth: "100px", maxWidth: "100px" }}
                                            />
                                        ) : (
                                            link.anchor?.text || "(no text)"
                                        )}
                                    </td>
                                <td>
                                    <Link href={link.url} target="_blank">{link.url}</Link>
                                </td>
                                <td
                                    className={
                                        link.statusCode >= 300 && link.statusCode < 400
                                        ? 'warning-background'
                                        : link.statusCode >= 400
                                            ? 'error-background'
                                            : ''
                                    }
                                    style={{ textAlign: 'center' }}
                                >{link.statusCode}</td>
                                <td>
                                    <Link href={link.finalUrl} target="_blank">{link.finalUrl}</Link>
                                </td>
                                <td>
                                    <ol>
                                        {link.redirectChain && link.redirectChain.length > 1
                                            ? link.redirectChain.map((r, idx) => (
                                                <li key={idx}>
                                                    <Link href={r.url} target="_blank">{r.url}</Link> ({r.statusCode})
                                                    {idx < link.redirectChain.length - 1 ? " → " : ""}
                                                </li>
                                            ))
                                            : "—"
                                        }
                                    </ol>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                : <p>No external links found on this page.</p>
            }
        </section>
    )
}