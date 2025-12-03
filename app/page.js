import Link from "next/link";

export const metadata = {
    title: "Free SEO tools to optimise your site | SEO Tools",
    description: "Check if your website is optimised for search engines with our free SEO tools.",
    alternates: {
        canonical: "https://seotools.uk/",
    },
}

export default function Home() {
    return (
        <>
            <h1>Home</h1>

            <p>This is the introductory paragraph for the Home page.</p>

            <h2>
                <Link href="/seo-on-page-checker">SEO On-Page Checker</Link>
            </h2>
        </>
    );
}