export default function ToolCard({ children, tool }) {
    return (
        <article className="tool-card">
            {children}
            <p>{tool.metaDescription}</p>
        </article>
    )
}