export async function scrapeOpenGraph($) {
    if (!$) return {};

    const openGraph = {
        title: "",
        type: "",
        url: "",
        description: "",
        image: "",
        siteName: "",
        video: "",
        audio: "",
        locale: "",
    };

    $("meta[property^='og:']").each((_, el) => {
        const property = $(el).attr("property");
        const content = $(el).attr("content")?.trim();
        if (!property || !content) return;

        let key = property.replace(/^og:/, "");
        if (key === "site_name") key = "siteName";

        openGraph[key] = content;
    });

    return { openGraph };
}
