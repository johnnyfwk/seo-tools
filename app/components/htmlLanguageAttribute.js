import { ISO_REGIONS, ISO_LANGUAGES } from "../lib/utils/languageMaps";

export default function HtmlLanguageAttribute({ htmlLanguageAttribute }) {
    const {
        attribute,
        isValid,
        issues
    } = htmlLanguageAttribute;

    if (!attribute) {
        return (
            <p>No lang attribute found.</p>
        )
    }

    const normalised = attribute.toLowerCase();
    const [languageCode, regionCode] = normalised.split("-");
    const languageName = ISO_LANGUAGES[languageCode] || null;
    const regionName = regionCode ? ISO_REGIONS[regionCode.toUpperCase()] : null;

    return (
        <>
            <div>
                <p>
                    <strong>Raw value:</strong> <code>{attribute}</code>
                </p>
            </div>
            
            <div>
                <p>
                    <strong>Language:</strong>{" "}
                    {languageCode.toUpperCase() || "-"}
                    {languageName ? ` (${languageName})` : ""}
                </p>
            </div>

            {regionCode
                ? <div>
                    <p>
                        <strong>Region:</strong>{" "}
                        {regionCode.toUpperCase()}
                        {regionName ? ` (${regionName})` : ""}
                    </p>
                </div>
                : null
            }

            {isValid === false
                ? <div>
                    <p className="error-text">
                        Invalid language format. Expected ISO format like:
                        <br />
                        <code>en</code>, <code>en-gb</code>, <code>fr-fr</code>, <code>es</code>.
                    </p>
                </div> 
                : null
            }

            {issues.length > 0
                ? <div>
                    <ul className="error-text">
                        {issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                        ))}
                    </ul>
                </div>
                : null
            }
        </>
    )
}