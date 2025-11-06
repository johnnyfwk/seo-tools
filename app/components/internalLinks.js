import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function InternalLinks({ internalLinks }) {
    return (
        <>
            {internalLinks
                ? <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th style={{ textAlign: 'center' }}>Link Type</th>
                            <th style={{ textAlign: 'left' }}>Anchor Text</th>
                            <th style={{ textAlign: 'left' }}>URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                            <th style={{ textAlign: 'center' }}>Link is allowed by Robots.txt?</th>
                            <th style={{ textAlign: 'center' }}>Link has Noindex tag?</th>
                            <th style={{ textAlign: 'center' }}>Link URL = Canonical URL?</th>
                            <th style={{ textAlign: 'center' }}>Link is Indexable?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {internalLinks.map((link, i) => (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>
                                    {i + 1}
                                </td>

                                <td style={{ textAlign: 'center' }}>
                                    {link.anchor.type}
                                </td>

                                <td>
                                    {link.anchor?.type?.toLowerCase() === 'image' ? (
                                        <img 
                                            src={link.anchor.src} 
                                            alt={link.anchor.alt || 'Image link'} 
                                            style={{ minWidth: "100px", maxWidth: "100px" }}
                                        />
                                    ) : (
                                        link.anchor?.text || "(no text)"
                                    )}
                                </td>

                                <td style={{ textAlign: 'left' }}>
                                    <Link
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >{link.url}</Link>
                                </td>

                                <td
                                    className={link.statusCode === 200
                                        ? 'success-background'
                                        : 'error-background'
                                    }
                                    style={{ textAlign: 'center' }}
                                >
                                    {link.statusCode}
                                </td>

                                <td style={{ textAlign: 'left' }}>
                                    <Link href={link.finalUrl} target="_blank">{link.finalUrl}</Link>
                                </td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={link.robotsTxtCheck.allowed
                                        ? "success-background"
                                        : "error-background"
                                    }
                                >
                                    {link.robotsTxtCheck.allowed ? "Yes" : "No"}
                                </td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={!link.isNoindex
                                        ? "success-background"
                                        : "error-background"
                                    }
                                >
                                    {!link.isNoindex ? "No" : "Yes"}
                                </td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={utils.normaliseUrl(link.url) === utils.normaliseUrl(link.canonicalUrl)
                                        ? "success-background"
                                        : "warning-background"
                                    }
                                >
                                    {utils.normaliseUrl(link.url) === utils.normaliseUrl(link.canonicalUrl) ? "Yes" : "No"}
                                </td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={link.isIndexable
                                        ? "success-background"
                                        : "error-background"
                                    }
                                >
                                    {link.isIndexable ? "Yes" : "No"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                : <p>No internal links found on this page.</p>
            }
        </>
    )
}