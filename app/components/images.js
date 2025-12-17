import Link from "next/link";
import * as utils from '@/app/lib/utils/utils';

export default function Images({ images }) {
    if (images.length === 0) {
        return <p>No images found.</p>
    }

    const issues = [];

    const nullStatusCodeImages = images.filter((image) => {
        return image.initialUrlStatusCode === null;
    })

    const non200images = images.filter((image) => {
        return image.initialUrlStatusCode !== null && image.initialUrlStatusCode !== 200;
    });

    const missingAltText = images.filter((image) => {
        return !image.alt;
    });

    if (nullStatusCodeImages.length > 0) {
        if (nullStatusCodeImages.length === 1) {
            issues.push("1 image could not be fetched");
        } else if (nullStatusCodeImages.length > 1) {
            issues.push(`${nullStatusCodeImages.length} images could not be fetched`);
        }
    }

    if (non200images.length > 0) {
        if (non200images.length === 1) {
            issues.push(`1 image returns a non-200 status code`);
        } else if (non200images.length > 1) {
            issues.push(`${non200images.length} images return a non-200 status code`);
        }
    }

    if (missingAltText.length > 0) {
        if (missingAltText.length === 1) {
            issues.push(`1 image is missing alt text`);
        } else if (missingAltText.length > 1) {
            issues.push(`${missingAltText.length} images are missing alt text`);
        }
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return <li key={i}>{issue}</li>
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }

            <div className="table-wrapper">
                <table style={{ width: "max-content" }}>
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

                                    <td style={{ textAlign: 'left' }}>
                                        <img
                                            src={image.src || undefined}
                                            alt={image.alt || ""}
                                            loading="lazy"
                                            style={{ maxHeight: "80px" }}
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
                                            ? <a
                                                href={image.src}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="component-links"
                                            >{image.src}</a>
                                            : "N/A"
                                        }
                                    </td>

                                    <td
                                        style={{ textAlign: 'center' }}
                                        className={utils.getInitialUrlStatusCodeClass(image.initialUrlStatusCode)}
                                    >
                                        {image.initialUrlStatusCode || "N/A"}
                                    </td>

                                    <td style={{ textAlign: "left" }}>
                                        {image.initialUrlStatusCode >= 300 && image.initialUrlStatusCode < 400
                                            ? image.finalUrl
                                                ? <a
                                                    href={image.finalUrl}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="component-links"
                                                >
                                                    {image.finalUrl}
                                                </a>
                                                : "N/A"
                                            : "-"
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
            </div>
        </div>
    )
}