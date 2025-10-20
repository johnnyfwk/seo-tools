export default function StatusCode({ statusCode, fetchError }) {
    let displayText = statusCode ?? (fetchError ? `Fetch error: ${fetchError}` : "Unknown");

    let className = "error-text";
    if (statusCode === 200) className = "success-text";
    else if (statusCode >= 300 && statusCode < 400) className = "warning-text";

    return (
        <section id="status-code">
            <h2>Status Code</h2>
            <p className={className}>{displayText}</p>
        </section>
    );
}