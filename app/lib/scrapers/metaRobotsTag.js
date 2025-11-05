export function scrapeMetaRobotsTag($, headers = {}) {
    const robotsTag = $('meta[name="robots"]').attr('content')?.trim() || null;

    return {
        metaRobotsTag: {
            content: robotsTag,
            allowsIndexing: robotsTag ? !robotsTag.toLowerCase().includes('noindex') : true,
            allowsFollowing: robotsTag ? !robotsTag.toLowerCase().includes('nofollow') : true,
        }
    };
}