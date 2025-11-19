import { ISO_REGIONS, ISO_LANGUAGES } from "../lib/utils/languageMaps";

export default function HtmlLanguageAttribute({ htmlLanguageAttribute }) {
    const {
        attribute,
        isValid,
        issues
    } = htmlLanguageAttribute;

    if (!attribute) {
        return (
            <p>
                No <code>lang</code> attribute found.
            </p>
        )
    }

    const normalised = attribute.toLowerCase();
    const [languageCode, regionCode] = normalised.split("-");
    const languageName = ISO_LANGUAGES[languageCode] || null;
    const regionName = regionCode ? ISO_REGIONS[regionCode.toUpperCase()] : null;

    return (
        <div>
            <p>
                <strong>Raw value:</strong> <code>{attribute}</code>
            </p>

            <p>
                <strong>Language:</strong>{" "}
                {languageCode.toUpperCase() || "-"}
                {languageName ? ` (${languageName})` : ""}
            </p>

            {regionCode
                ? <p>
                    <strong>Region:</strong>{" "}
                    {regionCode.toUpperCase()}
                    {regionName ? ` (${regionName})` : ""}
                </p>
                : null
            }

            {isValid === false
                ?  <p className="error-text">
                    Invalid language format. Expected ISO format like:
                    <br />
                    <code>en</code>, <code>en-gb</code>, <code>fr-fr</code>, <code>es</code>.
                </p>
                : null
            }

            {issues.length > 0
                ? <ul className="error-text">
                    {issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                    ))}
                </ul>
                : null
            }
        </div>
    )
}