export default function HtmlLanguageAttribute({ htmlLanguageAttribute }) {
    return (
        <section id="html-language-attribute">
            <h2>HTML Language Attribute</h2>
            {htmlLanguageAttribute
                ? <p>{htmlLanguageAttribute}</p>
                : <p>No HTML language attribute found.</p>
            }
        </section>
    )
}