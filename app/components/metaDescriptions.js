import * as utils from '@/app/lib/utils/utils';

export default function MetaDescriptions({ metaDescriptions }) {
    if (metaDescriptions.length === 0) {
        return <p>No meta description found.</p>
    }

    const recommendedMaxLength = 160;

    const numberOfMetaDescriptionsExceedingRecommendedMaxLength = metaDescriptions.filter((metaDesc) => {
        return metaDesc.length > recommendedMaxLength;
    });

    return (
        <>
            {numberOfMetaDescriptionsExceedingRecommendedMaxLength.length === 0
                ? <p>✅ The page has no meta descriptions exceeding the recommended length of {recommendedMaxLength} characters.</p>
                : <p>⚠️ The page has {numberOfMetaDescriptionsExceedingRecommendedMaxLength.length} meta description(s) that exceeds the recommended length of {recommendedMaxLength} characters.</p>
            }

            {metaDescriptions.length > 1
                ? <p>⚠️ Multiple meta description tags found.</p>
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
        </>
    )
}