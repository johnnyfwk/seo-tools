export function scrapeViewport($) {
    const viewportContent = $('meta[name="viewport"]').attr('content')?.trim() || null;

    return {
        viewport: viewportContent,
    };
}