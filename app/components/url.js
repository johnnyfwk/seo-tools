import Link from "next/link";

export default function Url({ url }) {
    return (
        <Link href={url} target="_blank">{url}</Link>
    )
}