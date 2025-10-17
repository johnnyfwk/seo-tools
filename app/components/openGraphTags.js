import Link from "next/link";

export default function OpenGraphTags({ openGraphTags }) {
    return (
        <section id="open-graph-tags">
            <h2>Open Graph Tags</h2>

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Tag</th>
                        <th style={{ textAlign: 'left' }}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Site Name</strong></td>
                        <td className={!openGraphTags.siteName ? "warning-background" : undefined}>{openGraphTags.siteName}</td>
                    </tr>
                    <tr>
                        <td><strong>URL</strong></td>
                        <td className={!openGraphTags.url ? "warning-background" : undefined}>
                            <Link href={openGraphTags.url} target="_blank">{openGraphTags.url}</Link>
                        </td>
                    </tr>
                    {openGraphTags.url
                        ? <>
                            <tr>
                                <td><strong>Is URL Indexable?</strong></td>
                                <td className={!openGraphTags.isOgUrlIndexable ? "error-background" : undefined}>{openGraphTags.isOgUrlIndexable ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td><strong>Status Code</strong></td>
                                <td className={openGraphTags.ogUrlStatusCode !== 200 ? "error-background" : undefined}>{openGraphTags.ogUrlStatusCode}</td>
                            </tr>
                            <tr>
                                <td><strong>Final URL</strong></td>
                                <td><Link href={openGraphTags.ogUrlFinalUrl} target="_blank">{openGraphTags.ogUrlFinalUrl}</Link></td>
                            </tr>
                        </>
                        : null
                    }
                    <tr>
                        <td><strong>Title</strong></td>
                        <td className={!openGraphTags.title ? "warning-background" : undefined}>{openGraphTags.title}</td>
                    </tr>
                    <tr>
                        <td><strong>Description</strong></td>
                        <td className={!openGraphTags.description ? "warning-background" : undefined}>{openGraphTags.description}</td>
                    </tr>
                    <tr>
                        <td><strong>Type</strong></td>
                        <td className={!openGraphTags.type ? "warning-background" : undefined}>{openGraphTags.type}</td>
                    </tr>
                    <tr>
                        <td><strong>Image</strong></td>
                        <td  className={!openGraphTags.image ? "warning-background" : undefined}>
                            {openGraphTags.image
                                ? <img
                                    src={openGraphTags.image || undefined}
                                    alt="Open Graph Tag Image"
                                    style={{ minWidth: "100px", maxWidth: "200px" }}
                                />
                                : null
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Locale</strong></td>
                        <td className={!openGraphTags.locale ? "warning-background" : undefined}>{openGraphTags.locale}</td>
                    </tr>
                    <tr>
                        <td><strong>Audio</strong></td>
                        <td className={!openGraphTags.audio ? "warning-background" : undefined}>{openGraphTags.audio}</td>
                    </tr>
                    <tr>
                        <td><strong>Video</strong></td>
                        <td className={!openGraphTags.video ? "warning-background" : undefined}>{openGraphTags.video}</td>
                    </tr>
                    <tr>
                        <td><strong>Determiner</strong></td>
                        <td className={!openGraphTags.determiner ? "warning-background" : undefined}>{openGraphTags.determiner}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}