export function scrapeMetaTitle($) {
    return {
        metaTitle: $('title')
            .map((i, element) => $(element).text())
            .get(),
    };
}