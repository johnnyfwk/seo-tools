export function scrapeMetaRobotsAndXRobotsTag($, headers = {}) {
    const metaRobotsTagContent = $('meta[name="robots"]').attr('content')?.trim() || null;
    const xRobotsTagContent = headers['x-robots-tag'] || headers['X-Robots-Tag'] || null;

    const allDirectives = [metaRobotsTagContent, xRobotsTagContent]
        .filter(c => c)
        .join(', ');

    return {
        metaRobotsAndXRobotsTag: {
            allDirectives,
            metaRobotsTagContent,
            xRobotsTagContent,
        }
    };
}