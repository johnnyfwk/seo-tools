import Link from "next/link";

export default function HttpRedirectsToHttps({ isRedirectedToHttps, redirectChain }) {
    return (
        <section>
            <h2>HTTP redirects to HTTPS? <span className={isRedirectedToHttps ? "success-text" : "error-text"}>{isRedirectedToHttps ? "Yes" : "No"}</span></h2>
            <p>URL redirects to <Link href={redirectChain[1].url} target="_blank">{redirectChain[1].url}</Link>.</p>
        </section>
    )
}