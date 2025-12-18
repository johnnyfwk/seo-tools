import Link from "next/link";
import { siteName } from "@/data/site";

export default function Footer() {
    return (
        <footer>
            <div className="footer-links">
                <Link href="/about">About</Link>
                <Link href="/terms-of-service">Terms of Service</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/disclaimer">Disclaimer</Link>
                <Link href="/cookie-policy">Cookie Policy</Link>
            </div>

            <div id="copyright">Copyright &copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</div>
        </footer>
    )
}