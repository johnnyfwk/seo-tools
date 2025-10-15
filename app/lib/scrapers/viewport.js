export function scrapeViewport($) {
    return {
        viewport: $('meta[name="viewport"]').attr('content') || "",
    };
}