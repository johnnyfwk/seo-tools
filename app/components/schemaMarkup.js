import JsonLdViewer from "./jsonTree";

export default function SchemaMarkup({ schemaMarkup }) {
    return (
        <section id="schema-markup">
            <h2>Schema Markup ({schemaMarkup.length || 0})</h2>

            {!schemaMarkup.length
                ? <p>No schema markup found.</p>
                : <JsonLdViewer schemaMarkup={schemaMarkup} />
            }
        </section>
    )
}