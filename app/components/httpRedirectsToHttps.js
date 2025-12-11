export default function HttpRedirectsToHttps({ redirectChain }) {
    if (!redirectChain || redirectChain.length === 0) {
        return <p>No redirects detected.</p>;
    }

    const firstUrl = redirectChain[0]?.url || null;
    const secondUrl = redirectChain[1]?.url || null;

    if (!firstUrl) return <p>⚠️ Could not determine the starting URL.</p>;

    if (firstUrl.startsWith("https://")) {
        return <p>URL already uses HTTPS protocol. No redirect needed.</p>;
    }

    if (firstUrl.startsWith("http://") && secondUrl?.startsWith("https://")) {
        return <p>✅ Yes - page correctly redirects from HTTP → HTTPS.</p>;
    }

    if (firstUrl.startsWith("http://") && (!secondUrl || !secondUrl.startsWith("https://"))) {
        return <p>❌ No - page does <b>not</b> redirect from HTTP → HTTPS.</p>;
    }

    return <p>⚠️ Unable to determine HTTP → HTTPS redirect status.</p>;
}