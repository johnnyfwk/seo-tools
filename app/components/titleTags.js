import * as utils from '@/app/lib/utils/utils';

export default function TitleTags({ titleTags }) {
    if (titleTags.length === 0) {
        return <p>No title tag found.</p>
    }

    const issues = [];

    const recommendedMaxLength = 60;

    const numberOfTitleTagsExceedingRecommendedMaxLength = titleTags.filter((titleTag) => {
        return titleTag.length > recommendedMaxLength;
    });

    if (titleTags.length > 1) {
        issues.push(`Multiple (${titleTags.length}) title tags found`);
    }

    if (numberOfTitleTagsExceedingRecommendedMaxLength.length === 1) {
        issues.push(`1 title tag exceeds the recommended length of ${recommendedMaxLength} characters`);
    } else if (numberOfTitleTagsExceedingRecommendedMaxLength.length > 1) {
        issues.push(`${numberOfTitleTagsExceedingRecommendedMaxLength.length} title tags exceed the recommended length of ${recommendedMaxLength} characters`);
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
                    {titleTags.map((metaTitle, i) => {
                        const lengthClass = metaTitle.length > recommendedMaxLength
                            ? "error-background"
                            : metaTitle.length <= recommendedMaxLength && metaTitle.length > 0
                                ? "success-background"
                                : ""

                        return (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>

                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaTitle)}</td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={lengthClass}
                                >{metaTitle.length}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}