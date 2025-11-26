export default function Url({ url }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >{url}</a>
    )
}