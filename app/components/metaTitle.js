import * as utils from '@/app/lib/utils/utils';

export default function MetaTitle({ metaTitle }) {
    return (
        <>
            {metaTitle.length > 0
                ? <>
                    {metaTitle.length > 1
                        ? <p className="warning-text">Multiple &lt;title&gt; tags found.</p>
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
                            {metaTitle.map((metaTitle, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaTitle)}</td>
                                        <td style={{ textAlign: 'center' }} className={metaTitle.length > 60 ? 'error-background' : null}>{metaTitle.length}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
                : <p className="error-text">No &lt;title&gt; tag found.</p>
            }
        </>
    )
}