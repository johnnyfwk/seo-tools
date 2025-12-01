import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function Images({ images }) {
    if (images.length === 0) {
        return <p>No images found.</p>
    }

    return (
        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: 'center' }}>#</th>
                    <th style={{ textAlign: 'left' }}>Image</th>
                    <th style={{ textAlign: 'left' }}>Alt Text</th>
                    <th style={{ textAlign: 'left' }}>URL</th>
                    <th style={{ textAlign: 'center' }}>Status Code</th>
                    <th style={{ textAlign: 'left' }}>Final URL</th>
                    <th style={{ textAlign: 'center' }}>Final URL Status Code</th>
                </tr>
            </thead>
            <tbody>
                {images.map((image, i) => {
                    return (
                        <tr key={i}>
                            <td style={{ textAlign: 'center' }}>{i + 1}</td>

                            <td style={{ textAlign: 'center' }}>
                                <img
                                    src={image.src || undefined}
                                    alt={image.alt || ""}
                                    loading="lazy"
                                    style={{ maxHeight: "100px" }}
                                />
                            </td>

                            <td
                                style={{ textAlign: 'left' }}
                                className={!image.alt ? "error-background" : undefined}
                            >
                                {image.alt}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {image.src
                                    ? <Link
                                        href={image.src}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >{image.src}</Link>
                                    : "N/A"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={utils.getInitialUrlStatusCodeClass(image.initialUrlStatusCode)}
                            >
                                {image.initialUrlStatusCode || "N/A"}
                            </td>

                            <td style={{ textAlign: 'left' }}>
                                {image.initialUrlStatusCode >= 200 && image.initialUrlStatusCode < 300
                                    ? "-"
                                    : image.finalUrl
                                        ? <a
                                            href={image.finalUrl}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            {image.finalUrl}
                                        </a>
                                        : "N/A"
                                }
                            </td>

                            <td
                                style={{ textAlign: 'center' }}
                                className={utils.getFinalUrlStatusCodeTextAndClass(
                                    image.initialUrlStatusCode,
                                    image.finalUrlStatusCode,
                                ).class}
                            >
                                {utils.getFinalUrlStatusCodeTextAndClass(
                                    image.initialUrlStatusCode,
                                    image.finalUrlStatusCode,
                                ).text}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}