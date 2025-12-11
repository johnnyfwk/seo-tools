export default function StatusCode({ statusCode }) {
    const code = Number(statusCode);

    const statusMessages = {
        // Success (2xx)
        200: "✅ OK",
        201: "ℹ️ Created",
        204: "ℹ️ No Content",

        // Redirects (3xx)
        301: "🔄 Moved Permanently",
        302: "🔄 Found (Temporary Redirect)",
        304: "🔄 Not Modified",
        307: "🔄 Temporary Redirect",
        308: "🔄 Permanent Redirect",

        // Client errors (4xx)
        400: "⚠️ Bad Request",
        401: "⚠️ Unauthorized",
        403: "⚠️ Forbidden",
        404: "❌ Not Found",
        410: "❌ Gone",
        429: "⚠️ Too Many Requests",

        // Server errors (5xx)
        500: "❌ Internal Server Error",
        502: "❌ Bad Gateway",
        503: "❌ Service Unavailable",
        504: "❌ Gateway Timeout",
    };

    let displayText;

    if (code) {
        const message = statusMessages[code] || "Unknown Status";
        displayText = message;
    } else {
        displayText = "No status code available.";
    }

    return (
        <table>
            <tbody>
                <tr style={{ textAlign: "left" }}>
                    <th>Code</th>
                    <td>{code || "N/A"}</td>
                </tr>
                <tr style={{ textAlign: "left" }}>
                    <th>Definition</th>
                    <td>{displayText || "N/A"}</td>
                </tr>
            </tbody>
        </table>
    );
}