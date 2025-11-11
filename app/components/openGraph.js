// import Link from "next/link";

// export default function OpenGraph({ openGraph }) {
//     return (
//         <table>
//             <thead>
//                 <tr>
//                     <th style={{ textAlign: 'left' }}>Tag</th>
//                     <th style={{ textAlign: 'left' }}>Value</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td><strong>Type</strong></td>
//                     <td className={!openGraph.type ? "warning-background" : undefined}>{openGraph.type}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>Site Name</strong></td>
//                     <td
//                         className={!openGraph.siteName && !openGraph.site_name
//                             ? "warning-background"
//                             : undefined}
//                     >{openGraph.siteName || openGraph.site_name}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>URL</strong></td>
//                     <td className={!openGraph.url ? "warning-background" : undefined}>
//                         {openGraph.url
//                             ? <Link
//                                 href={openGraph.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                             >{openGraph.url}</Link>
//                             : ""
//                         }
//                     </td>
//                 </tr>
//                 {openGraph.url
//                     ? <>
//                         <tr>
//                             <td><strong>URL Status Code</strong></td>
//                             <td className={openGraph.ogUrlStatusCode !== 200 ? "error-background" : undefined}>{openGraph.ogUrlStatusCode}</td>
//                         </tr>

//                         <tr>
//                             <td><strong>Final URL</strong></td>
//                             <td><Link href={openGraph.ogUrlFinalUrl} target="_blank">{openGraph.ogUrlFinalUrl}</Link></td>
//                         </tr>

//                         <tr>
//                             <td><strong>Is URL Indexable?</strong></td>
//                             <td
//                                 className={openGraph.ogUrlRobotsAllowed &&
//                                     openGraph.ogUrlStatusCode === 200 &&
//                                     openGraph.ogUrlIsSelfCanonical &&
//                                     !openGraph.ogUrlNoindex
//                                         ? "success-background"
//                                         : "error-background"
//                                 }
//                             >{openGraph.ogUrlRobotsAllowed &&
//                             openGraph.ogUrlStatusCode === 200 &&
//                             openGraph.ogUrlIsSelfCanonical &&
//                             !openGraph.ogUrlNoindex
//                                 ? "Yes"
//                                 : "No"
//                             }</td>
//                         </tr>
//                     </>
//                     : null
//                 }
//                 <tr>
//                     <td><strong>Title</strong></td>
//                     <td className={!openGraph.title ? "warning-background" : undefined}>{openGraph.title}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>Description</strong></td>
//                     <td className={!openGraph.description ? "warning-background" : undefined}>{openGraph.description}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>Image</strong></td>
//                     <td  className={!openGraph.image ? "warning-background" : undefined}>
//                         {openGraph.image
//                             ? <img
//                                 src={openGraph.image || undefined}
//                                 alt="Open Graph Tag Image"
//                                 style={{ minWidth: "100px", maxWidth: "200px" }}
//                             />
//                             : null
//                         }
//                     </td>
//                 </tr>
//                 <tr>
//                     <td><strong>Locale</strong></td>
//                     <td className={!openGraph.locale ? "warning-background" : undefined}>{openGraph.locale}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>Audio</strong></td>
//                     <td className={!openGraph.audio ? "warning-background" : undefined}>{openGraph.audio}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>Video</strong></td>
//                     <td className={!openGraph.video ? "warning-background" : undefined}>{openGraph.video}</td>
//                 </tr>
//                 <tr>
//                     <td><strong>Determiner</strong></td>
//                     <td className={!openGraph.determiner ? "warning-background" : undefined}>{openGraph.determiner}</td>
//                 </tr>
//             </tbody>
//         </table>
//     )
// }

import Link from "next/link";

export default function OpenGraph({ openGraph }) {
    const ignoredKeys = ['missingTags', 'site_name']; // ignore the raw key

    const readableMap = {
        title: 'Title',
        type: 'Type',
        url: 'URL',
        ogUrlStatusCode: 'URL Status Code',
        ogUrlFinalUrl: 'Final URL',
        ogUrlIsSelfCanonical: 'Canonical URL is Self-referential?',
        ogUrlNoindex: 'URL has Noindex tag?',
        ogUrlRobotsAllowed: 'URL is Allowed by Robots.txt?',
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
