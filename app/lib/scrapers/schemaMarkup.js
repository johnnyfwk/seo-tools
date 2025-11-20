function handleSchema(schema, schemas) {
    if (!schema) return;

    if (Array.isArray(schema)) {
        schema.forEach(s => handleSchema(s, schemas));
        return;
    }

    if (typeof schema !== 'object') return;

    const type = schema['@type'];
    schemas.push({
        type: Array.isArray(type) ? type.join(', ') : type || 'Unknown',
        format: 'JSON-LD',
        raw: schema,
    });

    if (schema['@graph']) {
        handleSchema(schema['@graph'], schemas); // recursive for array
    }
}


export function scrapeSchemaMarkup($) {
    const schemas = [];

    // --- JSON-LD ---
    $('script[type*="ld+json" i]').each((i, el) => {
        try {
            const jsonText = $(el).html().trim();
            const parsed = JSON.parse(jsonText);

            if (Array.isArray(parsed)) {
                parsed.forEach(schema => handleSchema(schema, schemas));
            } else if (parsed['@graph']) { // ✅ handle Yoast SEO schemas
                parsed['@graph'].forEach(schema => handleSchema(schema, schemas));
            } else {
                handleSchema(parsed, schemas);
            }
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Invalid JSON-LD schema:', e.message);
            }
        }
    });

    // --- Microdata ---
    $('[itemscope]').each((i, el) => {
        const type = $(el).attr('itemtype');

        if (type) {
            const typeName = type.trim().replace(/^https?:\/\/schema\.org\//, '');
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
            const typeName = type.trim().replace(/^schema:/, '');
            schemas.push({
                type: typeName,
                format: 'RDFa',
                raw: { typeof: type },
            });
        }
    });

    return { schemaMarkup: schemas };
}