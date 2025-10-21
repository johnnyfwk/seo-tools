import Link from "next/link";

export default function HttpRedirectsToHttps({ httpRedirectsToHttps, redirectChain }) {
    if (httpRedirectsToHttps === null) {
        return null;
    }

    return (
        <p className={httpRedirectsToHttps ? "success-text" : "error-text"}>{httpRedirectsToHttps ? "Yes" : "No"}</p>
    )
}