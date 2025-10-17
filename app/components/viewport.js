export default function Viewport({ viewport }) {
    return (
        <section id="html-viewport">
            <h2>Viewport</h2>

            {viewport
                ? <p><code>{viewport}</code></p>
                : <p>No meta viewport tag found.</p>
            }

            {viewport && viewport.includes("width=") && viewport.includes("initial-scale=")
                ? <p>Viewport tag has both <em>width</em> and <em>initial-scale</em> properties.</p>
                : null
            }

            {viewport && !viewport.includes("width=")
                ? <p className="error-text">Viewport tag missing <em>width</em> property.</p>
                : null
            }

            {viewport && !viewport.includes("initial-scale=")
                ? <p className="error-text">Viewport tag missing <em>initial-scale</em> property.</p>
                : null
            }
        </section>
    )
}