import * as utils from '@/app/lib/utils';

export default function MetaDescription({ metaDescription }) {
    return (
        <section id="meta-description">
            <h2>Meta Description</h2>
            
            {metaDescription.length === 0
                ? <p className="error-text">No meta description found.</p>
                : <>
                    {metaDescription.length > 1
                        ? <p className="warning-text">Multiple meta descriptions found.</p>
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
                            {metaDescription.map((metaDesc, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(metaDesc)}</td>
                                        <td style={{ textAlign: 'center' }} className={metaDesc.length > 160 ? 'error-background' : null}>{metaDesc.length}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            }
        </section>
    )
}