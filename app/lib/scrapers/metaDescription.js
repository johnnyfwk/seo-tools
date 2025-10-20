export function scrapeMetaDescription($) {
    return {
        metaDescription: $('meta[name="description"]')
            .map((i, element) => $(element).attr('content'))
            .get(),
    };
}