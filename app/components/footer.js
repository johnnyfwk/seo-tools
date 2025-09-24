import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </div>

            <div id="copyright">Copyright &copy; {new Date().getFullYear()} SEO Tools. All Rights Reserved.</div>
        </footer>
    )
}