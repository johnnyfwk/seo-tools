export function scrapeTitleTags($) {
    return {
        titleTags: $('title')
            .map((i, element) => $(element).text())
            .get(),
    };
}