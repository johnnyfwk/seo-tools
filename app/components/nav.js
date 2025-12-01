import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <Link href="/seo-on-page-checker">SEO On-Page Checker</Link>
            <Link href="/robots-txt-checker">Robots.txt Checker</Link>
            <Link href="/meta-robots-tag-checker">Meta Robots Tag Checker</Link>
            <Link href="/canonical-tag-checker">Canonical Tag Checker</Link>
            <Link href="/viewport-meta-tag-checker">Viewport Meta Tag Checker</Link>
            <Link href="/title-tag-and-meta-description-checker">Title Tag & Meta Description Length Checker</Link>
            <Link href="/h1-tag-and-headings-checker">H1 Tag & Heading Structure Checker</Link>
            <Link href="/internal-external-and-broken-link-checker">Internal, External & Broken Link Checker</Link>
            <Link href="/image-alt-text-checker">Image Alt Text Checker</Link>
            <Link href="/link-checker">Link Checker</Link>
        </nav>
    )
}