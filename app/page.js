import Link from "next/link";

export const metadata = {
    title: "This is the meta title for the Home page | SEO Tools",
    description: "This is the meta description for the Home page.",
}

export default function Home() {
    return (
        <div>
            <h1>Home</h1>

            <p>This is the introductory paragraph for the Home page.</p>

            <h2>
                <Link href="/on-page-checker">On-Page Checker</Link>
            </h2>
        </div>
    );
}