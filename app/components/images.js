import Link from "next/link";

export default function Images({ images }) {
    return (
        <section id="images">
            <h2>Images ({images.length || 0})</h2>

            {!images.length
                ? "No images found"
                : <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>#</th>
                            <th style={{ textAlign: 'left' }}>Image Preview</th>
                            <th style={{ textAlign: 'left' }}>Alt Text</th>
                            <th style={{ textAlign: 'left' }}>Source URL</th>
                            <th style={{ textAlign: 'center' }}>Status Code</th>
                            <th style={{ textAlign: 'left' }}>Final URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                    <td>
                                        <img
                                            src={image.src || undefined}
                                            alt={image.alt || ""}
                                            loading="lazy"
                                            style={{ minWidth: "100px", maxWidth: "100px" }}
                                        />
                                    </td>
                                    <td className={!image.alt ? "error-background" : undefined}>{image.alt}</td>
                                    <td>
                                        <Link
                                            href={image.src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >{image.src}</Link>
                                    </td>
                                    <td style={{ textAlign: 'center' }} className={image.statusCode !== 200 ? "error-background" : null}>{image.statusCode}</td>
                                    <td style={{ textAlign: 'left' }}>{image.finalUrl}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            }
        </section>
    )
}