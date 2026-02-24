export const ISO_LANGUAGES = {
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    nl: "Dutch",
    pt: "Portuguese",
    ru: "Russian",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    hi: "Hindi",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    pl: "Polish",
    tr: "Turkish",
    cs: "Czech",
    el: "Greek",
    he: "Hebrew",
    th: "Thai",
    vi: "Vietnamese",
    ro: "Romanian",
    hu: "Hungarian",
    sk: "Slovak",
    uk: "Ukrainian",
    bg: "Bulgarian",
    sr: "Serbian",
    hr: "Croatian",
    sl: "Slovenian",
};

// ISO 3166-1 Alpha-2 Region Codes
export const ISO_REGIONS = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    NZ: "New Zealand",
    DE: "Germany",
    FR: "France",
    ES: "Spain",
    IT: "Italy",
    NL: "Netherlands",
    BE: "Belgium",
    BR: "Brazil",
    MX: "Mexico",
    AR: "Argentina",
    CL: "Chile",
    CO: "Colombia",
    CN: "China",
    JP: "Japan",
    KR: "South Korea",
    RU: "Russia",
    IN: "India",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    PL: "Poland",
    TR: "Turkey",
    PT: "Portugal",
    RO: "Romania",
    UA: "Ukraine",
    CH: "Switzerland",
    AT: "Austria",
    IE: "Ireland",
};

export function getHumanReadableLang(langTag = "") {
    if (!langTag) return null;

    const [lang, region] = langTag.toLowerCase().split("-");

    const languageName = ISO_LANGUAGES[lang] || null;
    const regionName = region ? ISO_REGIONS[region.toUpperCase()] : null;

    if (languageName && regionName) {
        return `${languageName} (${regionName})`;
    }

    if (languageName) return languageName;

    if (lang) return lang.toUpperCase() + (region ? `-${region.toUpperCase()}` : "");

    return null;
}
