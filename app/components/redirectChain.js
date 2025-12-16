import Link from "next/link";

export default function RedirectChain({ redirectChain }) {
    if (redirectChain.length === 1) {
        return null;
    };

    return (
        <div className="table-wrapper">
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

                                <td style={{ textAlign: 'left' }}>
                                    <Link
                                        href={redirect.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >{redirect.url}</Link>
                                </td>

                                <td
                                    style={{ textAlign: 'center' }}
                                    className={redirect.statusCode === null
                                        ? ""
                                        : redirect.statusCode === 200
                                            ? "success-background"
                                            : redirect.statusCode >= 300 && redirect.statusCode < 400
                                                ? "warning-background"
                                                : "error-background"
                                    }
                                >{redirect.statusCode}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}