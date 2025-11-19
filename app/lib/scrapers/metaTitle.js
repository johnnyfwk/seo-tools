export function scrapeMetaTitle($) {
    return {
        metaTitles: $('title')
            .map((i, element) => $(element).text())
            .get(),
    };
}