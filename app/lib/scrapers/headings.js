export function scrapeHeadings($) {
    const headings = [];

    $('h1,h2,h3,h4,h5,h6').each((i, el) => {
        const level = el.tagName.toLowerCase();
        headings.push({
            level,
            text: $(el).text().trim(),
            order: i + 1,
        });
    });

    return { headings };
}