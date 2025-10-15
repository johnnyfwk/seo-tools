export function scrapeHtmlLangAttribute($) {
    return {
        htmlLangAttribute: $('html').attr('lang') || "",
    };
}