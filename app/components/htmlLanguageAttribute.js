export default function HtmlLanguageAttribute({ htmlLanguageAttribute }) {
    if (!htmlLanguageAttribute || htmlLanguageAttribute.trim() === "") {
        return <p>No HTML language attribute found.</p>;
    }

    const [language, region] = htmlLanguageAttribute.split('-');

    const formattedLanguage = language ? language.toUpperCase() : null;
    const formattedRegion = region ? region.toUpperCase() : null;

    return (
        <div>
            <p>
                <strong>Language:</strong> {formattedLanguage}
            </p>
            {formattedRegion
                ? <p>
                    <strong>Region:</strong> {formattedRegion}
                </p>
                : null
            }
        </div>
    )
}