import * as utils from'@/app/lib/utils/utils';

export default function Headings({ h1s, h2s, h3s, h4s, h5s, h6s }) {
    return (
        <>
            <section id="h1s">
                <h2>H1 Tags ({h1s.length})</h2>
                {h1s.length === 0
                    ? <p className="error-text">No &lt;h1&gt; tag found.</p>
                    : <>
                        {h1s.length > 1
                            ? <p className="warning-text">Multiple &lt;H1&gt; tags found.</p>
                            : null
                        }
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                    <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {h1s.map((h1, i) => {
                                    return (
                                        <tr key={i}>
                                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                            <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h1)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                }
            </section>

            <section id="h2s">
                <h2>H2 Tags ({h2s.length})</h2>
                {h2s.length === 0
                    ? <p>No &lt;H2&gt; tags found.</p>
                    : <table>
                        <thead>
                            <tr>
                                <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {h2s.map((h2, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </section>

            <section id="h3s">
                <h2>H3 Tags ({h3s.length})</h2>
                {h3s.length === 0
                    ? <p>No &lt;H3&gt; tags found.</p>
                    : <table>
                        <thead>
                            <tr>
                                <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {h3s.map((h3, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h3)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </section>

            <section id="h4s">
                <h2>H4 Tags ({h4s.length})</h2>
                {h4s.length === 0
                    ? <p>No &lt;H4&gt; tags found.</p>
                    : <table>
                        <thead>
                            <tr>
                                <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {h4s.map((h4, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h4)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </section>

            <section id="h5s">
                <h2>H5 Tags ({h5s.length})</h2>
                {h5s.length === 0
                    ? <p>No &lt;H5&gt; tags found.</p>
                    : <table>
                        <thead>
                            <tr>
                                <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {h5s.map((h5, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h5)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </section>

            <section id="h6s">
                <h2>H6 Tags ({h6s.length})</h2>
                {h6s.length === 0
                    ? <p>No &lt;H6&gt; tags found.</p>
                    : <table>
                        <thead>
                            <tr>
                                <th scope="col" style={{ textAlign: 'center' }}>#</th>
                                <th scope="col" style={{ textAlign: 'left' }}>Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            {h6s.map((h6, i) => {
                                return (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>{utils.highlightWhitespace(h6)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </section>
        </>
    )
}