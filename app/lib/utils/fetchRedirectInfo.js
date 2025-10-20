export async function fetchRedirectInfo(url) {
    let currentUrl = url;
    const redirectChain = [];

    // Ensure protocol
    if (!/^https?:\/\//i.test(currentUrl)) {
        currentUrl = 'http://' + currentUrl;
    }

    // Validate URL
    try {
        new URL(currentUrl);
    } catch {
        throw new Error('Invalid URL.');
    }

    // Prevent infinite redirect loops
    const maxRedirects = 10;
    let redirectCount = 0;

    // Follow redirect chain manually
    while (currentUrl && redirectCount < maxRedirects) {
        try {
            const res = await fetch(currentUrl, {
                method: 'GET', // Use GET instead of HEAD
                redirect: 'manual', // manually handle redirects
                headers: {
                    'User-Agent': 'SEO-Checker',
                    'Accept': 'text/html',
                },
            });

            redirectChain.push({
                url: currentUrl,
                statusCode: res.status,
            });

            const location = res.headers.get('location');
            if (location) {
                currentUrl = new URL(location, currentUrl).href;
                redirectCount++;
            } else {
                currentUrl = null;
            }
        } catch (err) {
            console.error(`Fetch failed for ${currentUrl}:`, err.message);
            redirectChain.push({
                url: currentUrl,
                statusCode: null,       // no HTTP status available
                fetchError: err.message, // store network/fetch error
            });
            break;
        }
    }

    const enteredUrlStatusCode = redirectChain[0]?.statusCode ?? null;
    const finalEntry = redirectChain[redirectChain.length - 1] || {};
    const finalUrl = finalEntry.url || url;
    const finalUrlStatusCode = finalEntry.statusCode ?? null;

    const httpRedirectsToHttps =
        redirectChain.length >= 2 &&
        redirectChain[0].url.startsWith('http://') &&
        redirectChain[1].url.startsWith('https://')
            ? true
            : redirectChain[0].url.startsWith('https://')
                ? null
                : false;

    return {
        redirectChain,
        httpRedirectsToHttps,
        enteredUrl: url,
        enteredUrlStatusCode,
        enteredUrlFetchError: redirectChain[0]?.fetchError || null,
        finalUrl,
        finalUrlStatusCode,
        finalUrlFetchError: finalEntry.fetchError || null,
    };
}
