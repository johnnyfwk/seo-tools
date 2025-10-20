import Link from "next/link";

export default function HttpRedirectsToHttps({ httpRedirectsToHttps, redirectChain }) {
    if (httpRedirectsToHttps === null) {
        return null;
    }

    return (
        <section>
            <h2>HTTP redirects to HTTPS?</h2>
            <p className={httpRedirectsToHttps ? "success-text" : "error-text"}>{httpRedirectsToHttps ? "Yes" : "No"}</p>
        </section>
    )
}