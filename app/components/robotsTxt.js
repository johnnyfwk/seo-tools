import Link from "next/link";

export default function RobotsTxt({ robotsTxt }) {
    return (
        <section id="robots-txt">
            <h2>URL allowed by Robots.txt? <span className={robotsTxt.enteredUrl.allowed ? "success-text" : "error-text"}>{robotsTxt.enteredUrl.allowed ? "Yes" : "No"}</span></h2>
            <p style={{ marginBottom: '10px'}}>
                <Link href={robotsTxt.enteredUrl.robotsTxtUrl || "#"} target="_blank">
                    {robotsTxt.enteredUrl.robotsTxtUrl || "robots.txt not found"}
                </Link>
            </p>
        </section>
    )
}