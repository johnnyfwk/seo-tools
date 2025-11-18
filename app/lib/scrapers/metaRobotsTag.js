export function scrapeMetaRobotsTag($, headers = {}) {
    const htmlTagContent = $('meta[name="robots"]').attr('content')?.trim() || null;
    const xRobotsTagContent = headers['x-robots-tag'] || headers['X-Robots-Tag'] || null;

    const allDirectives = [htmlTagContent, xRobotsTagContent]
        .filter(c => c) // Remove nulls/empties
        .join(', ');

    const robotsTagLower = allDirectives.toLowerCase() || '';

    const allowsIndexing = !robotsTagLower.includes('noindex');

    const allowsFollowing = !robotsTagLower.includes('nofollow');

    return {
        metaRobotsTag: {
            content: allDirectives,
            htmlTagContent,
            xRobotsTagContent,
            allowsIndexing,
            allowsFollowing,
        }
    };
}