export function scrapeMeta($) {
    return {
        metaRobotsTag: $('meta[name="robots"]').attr("content") || "",
        metaTitles: $('title').map((i, element) => $(element).text()).get(),
        metaDescriptions: $('meta[name="description"]')
            .map((i, element) => $(element).attr('content'))
            .get(),
    };
}