function handleSchema(schema, schemas, typesUsed) {
    const type = schema['@type'];

    if (type) {
        if (Array.isArray(type)) type.forEach(t => typesUsed.add(t));
        else typesUsed.add(type);
    }

    schemas.push({
        type: Array.isArray(type) ? type.join(', ') : type || 'Unknown',
        format: 'JSON-LD',
        raw: schema,
    });
}

export function scrapeSchema($) {
    const schemas = [];
    const typesUsed = new Set();

    // --- JSON-LD ---
    $('script[type*="ld+json" i]').each((i, el) => {
        try {
            const jsonText = $(el).html().trim();
            const parsed = JSON.parse(jsonText);

            if (Array.isArray(parsed)) {
                parsed.forEach(schema => handleSchema(schema, schemas, typesUsed));
            } else if (parsed['@graph']) { // ✅ handle Yoast SEO schemas
                parsed['@graph'].forEach(schema => handleSchema(schema, schemas, typesUsed));
            } else {
                handleSchema(parsed, schemas, typesUsed);
            }
        } catch (e) {
            // ignore invalid JSON
        }
    });

    // --- Microdata ---
    $('[itemscope]').each((i, el) => {
        const type = $(el).attr('itemtype');

        if (type) {
            const typeName = type.replace('https://schema.org/', '').replace('http://schema.org/', '');
            typesUsed.add(typeName);
            schemas.push({
                type: typeName,
                format: 'microdata',
                raw: { itemtype: type },
            });
        }
    });

    // --- RDFa ---
    $('[typeof]').each((i, el) => {
        const type = $(el).attr('typeof');

        if (type) {
            const typeName = type.replace('schema:', '');
            typesUsed.add(typeName);
            schemas.push({
                type: typeName,
                format: 'RDFa',
                raw: { typeof: type },
            });
        }
    });

    return {
        schemas,
        types: Array.from(typesUsed),
    };
}