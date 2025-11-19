export function scrapeMetaTitles($) {
    return {
        metaTitles: $('title')
            .map((i, element) => $(element).text())
            .get(),
    };
}