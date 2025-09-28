export function highlightWhitespace(str) {
if (!str) return str;

    const leadingMatch = str.match(/^(\s+)/);
    const trailingMatch = str.match(/(\s+)$/);

    const leading = leadingMatch ? leadingMatch[0] : "";
    const trailing = trailingMatch ? trailingMatch[0] : "";

    const core = str.substring(leading.length, str.length - trailing.length);

    return (
        <>
            {leading && (
                <span style={{ background: "yellow" }}>
                    {"␣".repeat(leading.length)}
                </span>
            )}
            {core}
            {trailing && (
                <span style={{ background: "yellow" }}>
                    {"␣".repeat(trailing.length)}
                </span>
            )}
        </>
    );
}