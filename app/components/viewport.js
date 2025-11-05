export default function Viewport({ viewport }) {
    if (!viewport) {
        return <p>No viewport tag found</p>;
    }

    return (
        <div>
            <p>
                <strong>Content:</strong> <code>{viewport}</code>
            </p>

            {viewport.includes("width=") && viewport.includes("initial-scale=")
                ? <p>Viewport tag has both <em>width</em> and <em>initial-scale</em> properties.</p>
                : null
            }

            {!viewport.includes("width=")
                ? <p className="error-text">Viewport tag missing <em>width</em> property.</p>
                : null
            }

            {!viewport.includes("initial-scale=")
                ? <p className="error-text">Viewport tag missing <em>initial-scale</em> property.</p>
                : null
            }
        </div>
    )
}