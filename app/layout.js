import "./globals.css";
import Link from "next/link";
import Nav from "./components/nav";
import Footer from "./components/footer";
import BackToTopButton from "./components/backToTopButton";
import { siteUrl, siteName, defaultTitle, defaultMetaDescription } from "@/data/pages";

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
          <Nav />
        </header>

        <main>
          {children}
        </main>

        <Footer />

        <BackToTopButton />
      </body>
    </html>
  );
}
