import Link from "next/link";

export default function CanonicalUrl({ enteredUrl, canonicalUrl }) {
    return (
        <section id="canonical-url">
            <h2>URL has a self-referencing Canonical URL? <span className={enteredUrl.replace(/\/$/, '') === canonicalUrl.replace(/\/$/, '') ? "success-text" : "warning-text"}>{enteredUrl.replace(/\/$/, '') === canonicalUrl.replace(/\/$/, '') ? "Yes" : "No"}</span></h2>
            <Link href={canonicalUrl} target="_blank">{canonicalUrl}</Link>
        </section>
    )
}