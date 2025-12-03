import "./globals.css";
import Link from "next/link";
import Nav from "./components/nav";
import Footer from "./components/footer";
import BackToTopButton from "./components/backToTopButton";

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
    canonical: "https://example.com/",
  },
  title: "Free SEO tools to optimise your site | SEO Tools",
  description: "Check if your website is optimised for search engines with our free SEO tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/" id="logo">SEO Tools</Link>
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
