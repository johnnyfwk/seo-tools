import * as utils from '@/app/lib/utils/utils';

export default function MetaDescriptions({ metaDescriptions }) {
    if (metaDescriptions.length === 0) {
        return <p>No meta description tag found.</p>
    }

    const recommendedMaxLength = 160;

    return (
        <>
            {metaDescriptions.length > 1
                ? <p className="warning-text">Multiple meta description tags found.</p>
                : null
            }
            
            <table>
                <thead>
                    <tr>
                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                        <th scope="col"  style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {metaDescriptions.map((metaDesc, i) => {
                        const statusTextAndClass = metaDesc.length === 0
                            ? {text: "Empty", class: "error-background"}
                            : metaDesc.length > recommendedMaxLength
                                ? {text: "Too Long", class: "warning-background"}
                                : {text: "OK", class: "success-background"}

                        return (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaDesc)}</td>
                                <td style={{ textAlign: 'center' }}>{metaDesc.length}</td>
                                <td
                                    style={{ textAlign: 'center' }}
                                    className={statusTextAndClass.class}
                                >{statusTextAndClass.text}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}