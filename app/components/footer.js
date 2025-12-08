import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </div>

            <div>
                <Link href="/terms-of-service">Terms of Service</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/disclaimer">Disclaimer</Link>
                <Link href="/cookie-policy">Cookie Policy</Link>
            </div>

            <div id="copyright">Copyright &copy; {new Date().getFullYear()} SEO Tools. All Rights Reserved.</div>
        </footer>
    )
}