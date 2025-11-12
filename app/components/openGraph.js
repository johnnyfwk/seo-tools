import Link from "next/link";

export default function OpenGraph({ openGraph }) {
    const ignoredKeys = ['missingTags', 'site_name']; // ignore the raw key

    const readableMap = {
        title: 'Title',
        type: 'Type',
        url: 'URL',
        ogUrlStatusCode: 'Status Code',
        ogUrlFinalUrl: 'Final URL',
        ogUrlIsSelfCanonical: 'URL has self-referencing canonical URL?',
        ogUrlNoindex: 'URL has noindex tag?',
        ogUrlRobotsAllowed: 'URL is allowed by robots.txt?',
        image: 'Image',
        'image:width': 'Image Width',
        'image:height': 'Image Height',
        description: 'Description',
        siteName: 'Site Name',
        audio: 'Audio',
        video: 'Video',
        locale: 'Locale',
        determiner: 'Determiner',
    };

    const ogEntries = Object.entries(openGraph)
        .filter(([key]) => !ignoredKeys.includes(key));

    // If no OG elements with values, return nothing
    const hasAnyOG = ogEntries.some(([_, value]) => value);
    if (!hasAnyOG) return <p>No OpenGraph elements found.</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {ogEntries.map(([key, value]) => {
                    let displayValue = value;

                    // URLs
                    if ((key === 'url' || key === 'ogUrlFinalUrl') && value) {
                        displayValue = <Link href={value} target="_blank">{value}</Link>;
                    }

                    // Images
                    if (key === 'image' && value) {
                        displayValue = <img src={value} alt="OG Image" style={{ maxWidth: "200px" }} />;
                    }

                    // Boolean fields as Yes/No
                    if (key === 'ogUrlNoindex' || key === 'ogUrlRobotsAllowed' || key === 'ogUrlIsSelfCanonical') {
                        displayValue = value ? 'Yes' : 'No';
                    }

                    // Empty fallback
                    if (displayValue === null || displayValue === '') displayValue = '-';

                    return (
                        <tr key={key}>
                            <td>{readableMap[key] || key}</td>
                            <td>{displayValue}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
