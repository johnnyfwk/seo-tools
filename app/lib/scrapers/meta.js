export function scrapeMeta($) {
    return {
        metaRobotsTag: $('meta[name="robots"]').attr("content") || "",
        metaTitles: $("title").map((i, el) => $(el).text()).get(),
        metaDescription: $('meta[name="description"]').attr("content") || "",
    };
}