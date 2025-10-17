import Link from "next/link";

export default function RobotsTxt({ robotsTxt }) {
    return (
        <section id="robots-txt">
            <h2>URL allowed by Robots.txt? <span className={robotsTxt.allowed ? "success-text" : "error-text"}>{robotsTxt.allowed ? "Yes" : "No"}</span></h2>
            <p style={{ marginBottom: '10px'}}>
                <Link href={robotsTxt.robotsUrl} target="_blank">{robotsTxt.robotsUrl}</Link>
            </p>
        </section>
    )
}