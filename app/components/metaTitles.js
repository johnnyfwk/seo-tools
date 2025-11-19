import * as utils from '@/app/lib/utils/utils';

export default function MetaTitles({ metaTitles }) {
    if (metaTitles.length === 0) {
        return <p>No &lt;title&gt; tag found.</p>
    }

    const recommendedMaxLength = 60;

    return (
        <>
            {metaTitles.length > 1
                ? <p className="warning-text">Multiple &lt;title&gt; tags found.</p>
                : null
            }

            <table>
                <thead>
                    <tr>
                        <th scope="col" style={{ textAlign: 'center' }}>#</th>
                        <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Length</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Recommended Length</th>
                        <th scope="col" style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {metaTitles.map((metaTitle, i) => {
                        const statusTextAndClass = metaTitle.length === 0
                            ? {text: "Empty", class: "error-background"}
                            : metaTitle.length > recommendedMaxLength
                                ? {text: "Too Long", class: "warning-background"}
                                : {text: "OK", class: "success-background"}

                        return (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>

                                <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaTitle)}</td>

                                <td style={{ textAlign: 'center' }}>{metaTitle.length}</td>

                                <td style={{ textAlign: 'center' }}>{recommendedMaxLength}</td>

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