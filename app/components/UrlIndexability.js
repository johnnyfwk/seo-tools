export default function UrlIndexability({ isUrlIndexable, indexabilityMessage }) {
    return (
        <section id="is-url-indexable">
            <h2>Is the URL indexable? <span className={isUrlIndexable ? "success-text" : "error-text"}>{isUrlIndexable ? "Yes" : "No"}</span></h2>
            <p>{indexabilityMessage}</p>
        </section>
    )
}