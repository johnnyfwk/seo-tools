import Link from "next/link";

export default function Url({ urlId, urlName, url }) {
    return (
        <section id={urlId}>
            <h2>{urlName}</h2>
            <p><Link href={url} target="_blank">{url}</Link></p>
        </section>
    )
}