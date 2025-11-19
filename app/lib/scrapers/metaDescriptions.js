export function scrapeMetaDescriptions($) {
    return {
        metaDescriptions: $('meta[name="description"]')
            .map((i, element) => $(element).attr('content'))
            .get(),
    };
}