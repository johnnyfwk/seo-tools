export function scrapeMeta($) {
    return {
        metaRobotsTag: $('meta[name="robots"]').attr("content") || "",
        metaTitle: $('title').map((i, element) => $(element).text()).get(),
        metaDescription: $('meta[name="description"]')
            .map((i, element) => $(element).attr('content'))
            .get(),
    };
}