export function scrapeHeadings($) {
    return {
        headings: {
            h1s: $('h1').map((i, el) => $(el).text()).get(),
            h2s: $('h2').map((i, el) => $(el).text()).get(),
            h3s: $('h3').map((i, el) => $(el).text()).get(),
            h4s: $('h4').map((i, el) => $(el).text()).get(),
            h5s: $('h5').map((i, el) => $(el).text()).get(),
            h6s: $('h6').map((i, el) => $(el).text()).get(),
        }
    };
}