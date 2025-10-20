import Link from "next/link";

export default function RedirectChain({ redirectChain }) {
    if (redirectChain.length === 1) {
        return null;
    };

    return (
        <section id="redirect-chain">
            <h2>Redirect Chain</h2>

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>#</th>
                        <th style={{ textAlign: 'left' }}>URL</th>
                        <th style={{ textAlign: 'center' }}>Status Code</th>
                    </tr>
                </thead>
                <tbody>
                    {redirectChain.map((redirect, i) => {
                        return (
                            <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                <td style={{ textAlign: 'left' }}><Link href={redirect.url}>{redirect.url}</Link></td>
                                <td style={{ textAlign: 'center' }}>{redirect.statusCode}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </section>
    )
}