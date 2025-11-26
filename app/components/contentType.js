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
        <>
            <p><strong>Content-Type:</strong> {contentType || "Unknown"}</p>
            <p><strong>Resource Type:</strong> {resourceType}</p>

            {isOther
                ? <p>
                    Canonical tags and meta robots tags do not apply to this resource type.
                </p>
                : null
            }
        </>

    )
}