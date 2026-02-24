export function scrapeViewport($) {
    const content = $('meta[name="viewport"]').attr('content')?.trim() || null;

    const properties = content
        ? content.split(',').reduce((acc, pair) => {
            const [key, value] = pair.split('=').map(s => s.trim());
            if (key) acc[key] = value ?? true;
            return acc;
        }, {})
        : {};

    return {
        viewport: {
            content,
            properties
        }
    };
}