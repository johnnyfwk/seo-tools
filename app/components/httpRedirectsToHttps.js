export default function HttpRedirectsToHttps({ redirectChain }) {
    if (!redirectChain || redirectChain.length === 0) {
        return <p>No redirects detected.</p>;
    }

    const firstUrl = redirectChain[0]?.url || null;
    const secondUrl = redirectChain[1]?.url || null;

    if (!firstUrl) return <p>⚠️ Could not determine URL.</p>;

    if (firstUrl.startsWith("https://")) {
        return <p>ℹ️ URL entered uses HTTPS protocol (no HTTP → HTTPS test performed).</p>;
    }

    if (firstUrl.startsWith("http://") && secondUrl?.startsWith("https://")) {
        return <p>✅ Yes</p>;
    }

    if (firstUrl.startsWith("http://") && (!secondUrl || !secondUrl.startsWith("https://"))) {
        return <p>❌ No</p>;
    }

    return <p>⚠️ Unable to determine HTTP → HTTPS redirect status.</p>;
}