import { browserHeaders } from "./browserHeaders";

export async function getRedirects(inputUrl) {
    let currentUrl = inputUrl;
    const redirects = [];
    let statusCode = null;
    const maxRedirects = 10;

    try {
        new URL(currentUrl);
    } catch {
        return {
            error: "Invalid URL",
            initialUrl: inputUrl,
            initialUrlStatusCode: null,
            finalUrl: inputUrl,
            finalUrlStatusCode: null,
            redirects: [],
        };
    }

    for (let i = 0; i < maxRedirects; i++) {
        let response;

        try {
            response = await fetch(currentUrl, {
                redirect: "manual",
                headers: browserHeaders,
            });
        } catch (err) {
            return {
                error: "Failed to fetch URL",
                initialUrl: inputUrl,
                initialUrlStatusCode: redirects[0]?.statusCode ?? null,
                finalUrl: currentUrl,
                finalUrlStatusCode: null,
                redirects,
            };
        }

        statusCode = response.status;

        redirects.push({
            url: currentUrl,
            statusCode,
        });

        if (![301, 302, 303, 307, 308].includes(statusCode)) {
            return {
                initialUrl: inputUrl,
                initialUrlStatusCode: redirects[0].statusCode,
                finalUrl: currentUrl,
                finalUrlStatusCode: statusCode,
                redirects,
            };
        }

        const location = response.headers.get("location");
        if (!location) {
            return {
                initialUrl: inputUrl,
                initialUrlStatusCode: redirects[0].statusCode,
                finalUrl: currentUrl,
                finalUrlStatusCode: statusCode,
                redirects,
            };
        }

        const nextUrl = new URL(location, currentUrl).href;
        currentUrl = nextUrl;
    }

    return {
        warning: "Max redirects reached",
        initialUrl: inputUrl,
        initialUrlStatusCode: redirects[0]?.statusCode ?? null,
        finalUrl: currentUrl,
        finalUrlStatusCode: statusCode,
        redirects,
    };
}
