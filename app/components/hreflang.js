import Link from "next/link";

export default function Hreflang({ hreflang }) {
    return (
        <section id="hreflang">
            <h2>Hreflang ({hreflang?.length || 0})</h2>

            {!hreflang?.length
                ? <p>No hreflang found.</p>
                : <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Source</th>
                            <th style={{ textAlign: 'center' }}>Hreflang</th>
                            <th style={{ textAlign: 'left' }}>URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'center' }}>URL is Indexable?</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {hreflang.map((hreflang, index) => {
                            return (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{hreflang.source}</td>
                                    <td style={{ textAlign: 'center' }}>{hreflang.hreflang}</td>
                                    <td style={{ textAlign: 'left' }}>
                                        <Link href={hreflang.url} target="_blank">{hreflang.url}</Link>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{hreflang.statusCode}</td>
                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={!hreflang.isIndexable ? "error-background" : undefined }
                                    >{hreflang.isIndexable ? "Yes" : "No"}</td>
                                    <td style={{ textAlign: 'left' }}>
                                        <Link href={hreflang.finalUrl} target="_blank">{hreflang.finalUrl}</Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            }
        </section>
    )
}