export async function scrapeImages($) {
    const images = $('img')
        .map((i, element) => {
            return (
                {
                    src: $(element).attr('src'),
                    alt: $(element).attr('alt') || "",
                }
            )
        })
        .get();
    
    return images;
}