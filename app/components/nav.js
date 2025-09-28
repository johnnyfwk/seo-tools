import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <Link href="/on-page-checker">On-Page Checker</Link>
            <Link href="link-checker">Link Checker</Link>
        </nav>
    )
}