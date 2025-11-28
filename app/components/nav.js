import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <Link href="/seo-on-page-checker">SEO On-Page Checker</Link>
            <Link href="/title-tag-and-meta-description-checker">Title Tag & Meta Description Length Checker</Link>
            <Link href="/robots-txt-checker">Robots.txt Checker</Link>
            <Link href="/link-checker">Link Checker</Link>
        </nav>
    )
}