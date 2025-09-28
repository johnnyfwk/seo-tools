export async function scrapeImages($, pageUrl) {
    const images = $('img')
        .map((i, element) => {
            let src = $(element).attr('src') || "";
            let alt = $(element).attr('alt') || "";

            // Resolve relative URLs
            try {
                if (src) {
                    src = new URL(src, pageUrl).href;
                }
            } catch {
                // If it's not a valid URL, leave it as-is
            }

            return { src, alt };
        })
        .get();

    return images;
}