export async function scrapeOpenGraphTags($, pageUrl) {
    const openGraphTags = {
        title: '',
        type: '',
        url: '',
        image: null,
        description: '',
        siteName: '',
        audio: '',
        video: '',
        locale: '',
        determiner: '',
        ogUrlStatusCode: '',
        ogUrlFinalUrl: '',
        isOgUrlIndexable: ''
    };

    $('meta[property^="og:"]').each((_, element) => {
        const property = $(element).attr('property');
        const content = $(element).attr('content');

        if (property && content) {
            const key = property.replace(/^og:/, '');
        if (openGraphTags.hasOwnProperty(key)) {
            openGraphTags[key] = content;
        } else {
            openGraphTags[key] = content;
        }
        }
    });

    const ogUrl = openGraphTags.url;

    if (ogUrl) {
        async function fetchOgUrlStatus(url) {
            let currentUrl = url;
            let ogUrlStatusCode = '';
            let ogUrlFinalUrl = url;
            let xRobots = '';
            let isOgUrlIndexable = '';

            while (currentUrl) {
                try {
                const response = await fetch(currentUrl, {
                    method: 'HEAD',
                    redirect: 'manual',
                });

                ogUrlStatusCode = String(response.status);
                xRobots = response.headers.get('x-robots-tag') || '';
                const location = response.headers.get('location');
                if (location) {
                    currentUrl = new URL(location, currentUrl).href;
                    ogUrlFinalUrl = currentUrl;
                } else {
                    currentUrl = null;
                }
                } catch {
                    ogUrlStatusCode = 'Could not fetch';
                    currentUrl = null;
                }
            }

            const xNoIndex = /noindex/i.test(xRobots);
            isOgUrlIndexable = !xNoIndex;

            return { ogUrlStatusCode, ogUrlFinalUrl, isOgUrlIndexable };
        }

        const { ogUrlStatusCode, ogUrlFinalUrl, isOgUrlIndexable } = await fetchOgUrlStatus(ogUrl);
        openGraphTags.ogUrlStatusCode = ogUrlStatusCode;
        openGraphTags.ogUrlFinalUrl = ogUrlFinalUrl;
        openGraphTags.isOgUrlIndexable = isOgUrlIndexable;
    }

    // Map for human-readable names
    const readableMap = {
        title: 'Title',
        type: 'Type',
        url: 'URL',
        image: 'Image',
        description: 'Description',
        siteName: 'Site Name',
        audio: 'Audio',
        video: 'Video',
        locale: 'Locale',
        determiner: 'Determiner',
        ogUrlStatusCode: 'OG URL Status Code',
        ogUrlFinalUrl: 'OG URL Final URL',
        isOgUrlIndexable: 'Is OG URL Indexable'
    };

    // Compute missing OG fields
    const missingTags = Object.entries(openGraphTags)
        .filter(([key, value]) => value === '' || value === null)
        .map(([key]) => readableMap[key] || key); // fallback to key

    openGraphTags.missingTags = [...missingTags];

    return { openGraphTags };
}