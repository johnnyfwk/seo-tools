import * as utils from '@/app/lib/utils/utils';

export default function MetaDescriptions({ metaDescriptions }) {
    if (metaDescriptions.length === 0) {
        return <p>No meta description found.</p>
    }

    const issues = [];

    const recommendedMaxLength = 160;

    const numberOfMetaDescriptionsExceedingRecommendedMaxLength = metaDescriptions.filter((metaDesc) => {
        return metaDesc.length > recommendedMaxLength;
    });

    if (metaDescriptions.length > 1) {
        issues.push(`Multiple (${metaDescriptions.length}) meta descriptions found.`);
    }

    if (numberOfMetaDescriptionsExceedingRecommendedMaxLength.length === 1) {
        issues.push(`1 meta description exceeds the recommended length of ${recommendedMaxLength} characters.`);
    } else if (numberOfMetaDescriptionsExceedingRecommendedMaxLength.length > 1) {
        issues.push(`${numberOfMetaDescriptionsExceedingRecommendedMaxLength.length} meta descriptions exceed the recommended length of ${recommendedMaxLength} characters.`);
    }

    return (
        <div>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Issues found:</strong>
                    </p>
                    <ul>
                        {issues.map((issue, i) => {
                            return <li key={i}>{issue}</li>
                        })}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }
            
            <table>
                <thead>
                    <tr>
                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                    </tr>
                </thead>
                <tbody>
                    {metaDescriptions.map((metaDesc, i) => {
                        const lengthClass = metaDesc.length > recommendedMaxLength
                            ? "error-background"
                            : metaDesc.length <= recommendedMaxLength && metaDesc.length > 0
                                ? "success-background"
                                : ""

                        return (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>

                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaDesc)}</td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={lengthClass}
                                >{metaDesc.length}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}