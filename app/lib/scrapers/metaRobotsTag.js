export function scrapeMetaRobotsTag($) {
    const robotsTag = $('meta[name="robots"]').attr('content')?.trim() || null;
    const robotsTagLower = robotsTag?.toLowerCase() || '';

    return {
        metaRobotsTag: {
            content: robotsTag,
            allowsIndexing: !robotsTagLower.includes('noindex'),
            allowsFollowing: !robotsTagLower.includes('nofollow'),
        }
    };
}