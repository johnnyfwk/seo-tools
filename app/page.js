import Link from "next/link";

export const metadata = {
    title: "This is the title tag for the Home page | SEO Tools",
    description: "This is the meta description for the Home page.",
}

export default function Home() {
    return (
        <>
            <h1>Home</h1>

            <p>This is the introductory paragraph for the Home page.</p>

            <h2>
                <Link href="/seo-on-page-checker">SEO On-Page Checker</Link>
            </h2>

            <h2>
                <Link href="/title-tag-and-meta-description-checker">Title Tag & Meta Description Length Checker</Link>
            </h2>

            <h2>
                <Link href="/link-checker">Internal Link & Backlink Checker</Link>
            </h2>
        </>
    );
}