import "./globals.css";
import { siteUrl, siteName, defaultTitle, defaultMetaDescription } from "@/data/pages";
import Link from "next/link";
import NavAndNavButton from "./components/navAndNavButton";
import Footer from "./components/footer";
import BackToTopButton from "./components/backToTopButton";
import CookieConsent from "./components/cookieConsent";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  title: `${defaultTitle} | ${siteName}`,
  description: defaultMetaDescription,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/" id="logo">{siteName}</Link>
          <NavAndNavButton />
        </header>

        <main>
          {children}
        </main>

        <Footer />

        <CookieConsent />

        <BackToTopButton />
      </body>
    </html>
  );
}
