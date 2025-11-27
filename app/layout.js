import "./globals.css";
import Link from "next/link";
import Nav from "./components/nav";
import Footer from "./components/footer";
import BackToTopButton from "./components/backToTopButton";

export const metadata = {
  title: "This is the default title tag | SEO Tools",
  description: "This is the default meta description.",
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
