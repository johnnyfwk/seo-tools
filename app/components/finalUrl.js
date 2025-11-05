import Link from "next/link";

export default function FinalUrl({ finalUrl, finalUrlStatusCode }) {
    return (
        <section id="final-url">
            <h2>Final URL</h2>
            <p>
                <Link
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >{finalUrl}</Link> ({finalUrlStatusCode})
            </p>
        </section>
    )
}