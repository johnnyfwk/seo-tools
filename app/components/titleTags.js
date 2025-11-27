import * as utils from '@/app/lib/utils/utils';

export default function TitleTags({ titleTags }) {
    if (titleTags.length === 0) {
        return <p>No title tag found.</p>
    }

    const recommendedMaxLength = 60;

    const numberOfTitleTagsExceedingRecommendedMaxLength = titleTags.filter((titleTag) => {
        return titleTag.length > recommendedMaxLength;
    });

    return (
        <>
            {numberOfTitleTagsExceedingRecommendedMaxLength.length === 0
                ? <p>✅ The page has no title tags exceeding the recommended length of {recommendedMaxLength} characters.</p>
                : <p>⚠️ The page has {numberOfTitleTagsExceedingRecommendedMaxLength.length} title tag(s) that exceeds the recommended length of {recommendedMaxLength} characters.</p>
            }

            {titleTags.length > 1
                ? <p>⚠️ Multiple title tags found.</p>
                : null
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
        </>
    )
}