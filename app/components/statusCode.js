export default function StatusCode({ statusCode }) {
    const code = Number(statusCode);

    const statusMessages = {
        200: "✅ OK",
        201: "Created",
        204: "No Content",
        301: "Moved Permanently",
        302: "Found (Temporary Redirect)",
        304: "Not Modified",
        307: "Temporary Redirect",
        308: "Permanent Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        410: "Gone",
        429: "Too Many Requests",
        500: "Internal Server Error",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
    };

    let displayText;

    if (code) {
        const message = statusMessages[code] || "Unknown Status";
        displayText = message;
    } else {
        displayText = "No status code available.";
    }

    return (
        <>
            <p>
                <strong>Code: </strong>
                <span>{code || "N/A"}</span>
            </p>
            <p>
                <strong>Definition: </strong>
                <span>{displayText}</span>
            </p>
        </>
    );
}