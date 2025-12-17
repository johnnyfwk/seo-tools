import * as utils from '@/app/lib/utils/utils';

export default function Headings({ headings }) {
    if (headings.length === 0) {
        return <p>No headings found.</p>;
    }

    const headingLevels = ['h1','h2','h3','h4','h5','h6'];

    const grouped = headingLevels.reduce((acc, level) => {
        acc[level] = headings.filter(h => h.level === level);
        return acc;
    }, {});

    // Require H1 to exist
    const issues = [];

    // 1️⃣ Check for missing H1
    if (grouped.h1.length === 0) {
        issues.push('h1');
    }

    // 2️⃣ Identify all used heading levels
    const usedLevels = headingLevels.filter(level => grouped[level].length > 0);

    if (usedLevels.length > 0) {
        // Determine the lowest and highest used levels (e.g., h1 → h4)
        const firstUsedIndex = headingLevels.indexOf(usedLevels[0]);
        const lastUsedIndex = headingLevels.indexOf(usedLevels[usedLevels.length - 1]);

        // 3️⃣ Check intermediate levels for gaps
        for (let i = firstUsedIndex + 1; i < lastUsedIndex; i++) {
            const level = headingLevels[i];
            if (grouped[level].length === 0) {
                issues.push(level);
            }
        }
    }

    return (
        <>
            {issues.length > 0
                ? <div>
                    <p>
                        <strong>⚠️ Issue(s) found:</strong>
                    </p>
                    <ul>
                        {issues.map(level => (
                            <li key={level}>{level} tag missing</li>
                        ))}
                    </ul>
                </div>
                : <p>✅ No issues found.</p>
            }

            {headingLevels.map(level => (
                <section key={level} id={level} className="section-margin-bottom">
                    <h3>{level.toUpperCase()} Tags ({grouped[level].length})</h3>
                    
                    {grouped[level].length === 0
                        ? <p>No {level} tags found.</p>
                        : <table>
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
                    }
                </section>
            ))}
        </>
    );
}
