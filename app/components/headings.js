import * as utils from '@/app/lib/utils/utils';

export default function Headings({ headings }) {
    const headingLevels = ['h1','h2','h3','h4','h5','h6'];

    const grouped = headingLevels.reduce((acc, level) => {
        acc[level] = headings.filter(h => h.level === level);
        return acc;
    }, {});

    const firstLevelIndex = headingLevels.findIndex(level => grouped[level].length > 0);
    const lastLevelIndex = headingLevels.slice().reverse().findIndex(level => grouped[level].length > 0);
    const deepestLevelIndex = headingLevels.length - 1 - lastLevelIndex;

    const missingLevels = [];
    for (let i = firstLevelIndex + 1; i < deepestLevelIndex; i++) {
        if (grouped[headingLevels[i]].length === 0) {
            missingLevels.push(headingLevels[i]);
        }
    }

    return (
        <>
            {missingLevels.length > 0
                ? <div>
                    <p>Hierarchy issues found:</p>
                    <ul>
                        {missingLevels.map(level => (
                            <li
                                key={level}
                                className="error-text"
                            >&lt;{level}&gt; tag missing</li>
                        ))}
                    </ul>
                </div>
                : null
            }

            {headingLevels.map(level => (
                <section key={level} id={level}>
                    <h4>{level.toUpperCase()} Tags ({grouped[level].length})</h4>
                    {grouped[level].length === 0 ? (
                        <p>No &lt;{level}&gt; tags found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>#</th>
                                    <th style={{ textAlign: 'left' }}>Text</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grouped[level].map((h, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            {utils.highlightWhitespace(h.text)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            ))}
        </>
    );
}
