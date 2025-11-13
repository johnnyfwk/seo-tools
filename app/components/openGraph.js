import Link from "next/link";

export default function OpenGraph({ openGraph }) {
    if (Object.values(openGraph.data).every(value => !value)) {
        return <p>No open graph tags found.</p>
    }

    const ogUrlStatusCodeClassName = openGraph.ogUrlRedirectInfo.enteredUrlStatusCode === 200
        ? "success-background"
        : "error-background"

    const ogUrlFinalUrlStatusCodeClassName = openGraph.ogUrlRedirectInfo.finalUrlStatusCode === 200
        ? "success-background"
        : "error-background"

    return (
        <table>
            <thead>
                <tr>
                    <th style={{textAlign: "left"}}>Property</th>
                    <th style={{textAlign: "left"}}>Content</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(openGraph.data).map(([key, value]) => (
                    <tr key={key}>
                        {key === "url"
                            ? <>
                                <td>url</td>
                                <td>
                                    <Link
                                        href={value}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >{value}</Link>
                                </td>
                            </>
                            : key === "image"
                                ? <>
                                    <td>image</td>
                                    <td>
                                        <Link
                                            href={value}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >{value}</Link>
                                    </td>
                                </>
                                : <>
                                    <td>{key}</td>
                                    <td>{value || "-"}</td>
                                </>
                        }
                    </tr>
                ))}

                {openGraph.ogUrlRedirectInfo
                    ? <tr>
                        <td>URL Status Code</td>
                        <td
                            className={ogUrlStatusCodeClassName}
                        >{openGraph.ogUrlRedirectInfo.enteredUrlStatusCode}</td>
                    </tr>
                    : null
                }

                {openGraph.ogUrlRedirectInfo && openGraph.ogUrlRedirectInfo.enteredUrlStatusCode !== 200
                    ? <>
                        <tr>
                            <td>Final URL</td>
                            <td>
                                <Link
                                    href={openGraph.ogUrlRedirectInfo.finalUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >{openGraph.ogUrlRedirectInfo.finalUrl}</Link>
                            </td>
                        </tr>
                        <tr>
                            <td>Final URL Status Code</td>
                            <td
                                className={ogUrlFinalUrlStatusCodeClassName}
                            >{openGraph.ogUrlRedirectInfo.finalUrlStatusCode}</td>
                        </tr>
                    </>
                    : null
                }

                {openGraph.ogUrlCanonicalUrl
                    ? <tr>
                        <td>Canonical URL of OG URL</td>
                        <td>
                            <Link
                                href={openGraph.ogUrlCanonicalUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                            >{openGraph.ogUrlCanonicalUrl}</Link>
                        </td>
                    </tr>
                    : null
                }
            </tbody>
        </table>
    );
}
