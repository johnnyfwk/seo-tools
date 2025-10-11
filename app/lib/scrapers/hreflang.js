export function scrapeHreflang($, headers = {}) {
    const hreflangs = [];

    // 1️⃣ <link> tags — correct implementation
    $('link[hreflang]').each((i, el) => {
        hreflangs.push({
            source: '<link>',
            rel: $(el).attr('rel') || null,
            hreflang: $(el).attr('hreflang')?.trim() || null,
            url: $(el).attr('href')?.trim() || null,
            isValid: !!$(el).attr('href') && !!$(el).attr('hreflang'),
        });
    });

    // 2️⃣ <a hreflang> — often incorrect but worth noting
    $('a[hreflang]').each((i, el) => {
        hreflangs.push({
            source: '<a>',
            rel: $(el).attr('rel') || null,
            hreflang: $(el).attr('hreflang')?.trim() || null,
            url: $(el).attr('href')?.trim() || null,
            isValid: false, // not a valid hreflang location
        });
    });

    // 3️⃣ <meta name="hreflang"> — unusual but possible
    $('meta[name="hreflang"]').each((i, el) => {
        hreflangs.push({
            source: '<meta>',
            rel: null,
            hreflang: $(el).attr('content')?.trim() || null,
            url: null,
            isValid: false, // invalid location
        });
    });

    // 4️⃣ HTTP headers (if passed from fetch)
    // Example header:
    // Link: <https://example.com/en-gb/>; rel="alternate"; hreflang="en-gb"
    const linkHeader = headers['link'] || headers['Link'];
    if (linkHeader) {
        const matches = linkHeader.matchAll(
            /<([^>]+)>;\s*rel=["']?alternate["']?;\s*hreflang=["']?([a-zA-Z-]+)["']?/g
        );
        for (const match of matches) {
            hreflangs.push({
                source: 'HTTP header',
                rel: 'alternate',
                hreflang: match[2].toLowerCase(),
                url: match[1],
                isValid: true,
            });
        }
    }

    // 5️⃣ Return *everything* — even duplicates and malformed entries
    return { hreflangs };
}