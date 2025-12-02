function handleStructuredData(node, results) {
    if (!node) return;

    if (Array.isArray(node)) {
        node.forEach(child => handleStructuredData(child, results));
        return;
    }

    if (typeof node !== 'object') return;

    const type = node['@type'];
    results.push({
        type: Array.isArray(type) ? type.join(', ') : type || 'Unknown',
        format: 'JSON-LD',
        raw: node,
    });

    const graph = node['@graph'];
    if (Array.isArray(graph)) {
        graph.forEach(child => handleStructuredData(child, results));
    }
}

export function scrapeStructuredData($) {
    const results = [];

    // --- JSON-LD ---
    $('script[type*="ld+json" i]').each((i, el) => {
        try {
            const jsonText = $(el).html().trim();
            const parsed = JSON.parse(jsonText);

            if (Array.isArray(parsed)) {
                parsed.forEach(node => handleStructuredData(node, results));
            } else if (parsed['@graph']) { // ✅ handle Yoast SEO structured data
                parsed['@graph'].forEach(node => handleStructuredData(node, results));
            } else {
                handleStructuredData(parsed, results);
            }
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Invalid JSON-LD structured data:', e.message);
            }
        }
    });

    // --- Microdata ---
    $('[itemscope]').each((i, el) => {
        const type = $(el).attr('itemtype');

        if (type) {
            const typeName = type.trim().replace(/^https?:\/\/schema\.org\//, '');
            results.push({
                type: typeName,
                format: 'Microdata',
                raw: { itemtype: type },
            });
        }
    });

    // --- RDFa ---
    $('[typeof]').each((i, el) => {
        const type = $(el).attr('typeof');

        if (type) {
            const typeName = type.trim().replace(/^schema:/, '');
            results.push({
                type: typeName,
                format: 'RDFa',
                raw: { typeof: type },
            });
        }
    });

    return { structuredData: results };
}