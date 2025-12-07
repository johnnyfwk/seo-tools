export function scrapeMetaRobotsAndXRobotsTag($, headers = {}) {
    const metaRobotsTagContent = $('meta[name="robots"]').attr('content')?.trim() || null;
    const xRobotsTagContent = headers['x-robots-tag'] || headers['X-Robots-Tag'] || null;

    const allDirectives = [metaRobotsTagContent, xRobotsTagContent]
        .filter(c => c) // Remove nulls/empties
        .join(', ');

    return {
        metaRobotsAndXRobotsTag: {
            allDirectives,
            metaRobotsTagContent,
            xRobotsTagContent,
        }
    };
}