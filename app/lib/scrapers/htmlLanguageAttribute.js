export function scrapeHtmlLanguageAttribute($) {
    return {
        htmlLanguageAttribute: ($('html').attr('lang') || "").toLowerCase(),
    };
}