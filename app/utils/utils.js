export function highlightWhitespace(str) {
    if (!str) return str;

    let highlighted = str;

    // Highlight leading spaces
    highlighted = highlighted.replace(/^(\s+)/, match => 
        <span style={{ background: "yellow" }}>{'␣'.repeat(match.length)}</span>
    );

    // Highlight trailing spaces
    highlighted = highlighted.replace(/(\s+)$/, match => 
        <span style={{ background: "yellow" }}>{'␣'.repeat(match.length)}</span>
    );

    return highlighted;
}