export function scrapeHtmlLanguageAttribute($) {
    let lang =
        $('html').attr('lang') ||
        $('html').attr('xml:lang') || 
        "";

    lang = lang.trim().toLowerCase();

    const isValid = /^[a-z]{2,3}(-[a-z0-9]{2,8})?$/.test(lang);

    return {
        htmlLanguageAttribute: {
            attribute: lang,
            isValid: isValid,
            issues: !isValid && lang
                ? [`Invalid language attribute format: "${lang}"`]
                : lang === ""
                    ? ["No HTML language attribute set."]
                    : [],
        }
    };
}