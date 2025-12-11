import { ISO_REGIONS, ISO_LANGUAGES } from "../lib/utils/languageMaps";

export default function HtmlLanguageAttribute({ htmlLanguageAttribute }) {
    const {
        attribute,
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
        <div>
            {issues.length > 0
                ? <div>
                    <p>⚠️ Issues found:</p>
                    <ul>
                        {issues.map((issue, i) => (
                            <li key={i}>{issue}</li>
                        ))}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }

            <table>
                <tbody>
                    <tr style={{ textAlign: "left" }}>
                        <th>Raw Value</th>
                        <td>{attribute || "N/A"}</td>
                    </tr>

                    <tr style={{ textAlign: "left" }}>
                        <th>Language</th>
                        <td>
                            {languageCode.toUpperCase() || "-"}
                            {languageName
                                ? ` (${languageName})`
                                : ""
                            }
                        </td>
                    </tr>

                    {regionCode
                        ? <tr style={{ textAlign: "left" }}>
                            <th>Region</th>
                            <td>
                                {regionCode.toUpperCase()}
                                {regionName 
                                    ? ` (${regionName})`
                                    : ""
                                }
                            </td>
                        </tr>
                        : null
                    }
                </tbody>
            </table>
        </div>
    )
}