export default function ContentType({
    contentType,
    isHtml,
    isPdf,
    isImage,
    isCss,
    isJs,
    isOther
}) {
    let resourceType = "Unknown";
    if (isHtml) resourceType = "HTML Page";
    else if (isPdf) resourceType = "PDF Document";
    else if (isImage) resourceType = "Image File";
    else if (isCss) resourceType = "Cascading Style Sheets (CSS) File";
    else if (isJs) resourceType = "JavaScript File";
    else if (isOther) resourceType = "Other File Type";

    return (
        <table>
            <tbody>
                <tr style={{ textAlign: "left" }}>
                    <th>Content Type</th>
                    <td>{contentType || "Unknown"}</td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <th>Resource Type</th>
                    <td>{resourceType || "Unknown"}</td>
                </tr>
            </tbody>
        </table>
    )
}