import "./globals.css";
import Link from "next/link";
import NavAndNavButton from "./components/navAndNavButton";
import Footer from "./components/footer";
import BackToTopButton from "./components/backToTopButton";
import CookieConsent from "./components/cookieConsent";
import {
  siteUrl,
  siteName,
  defaultTitle,
  defaultMetaDescription,
  openGraphLocale,
  openGraphType,
} from "@/data/site";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  title: `${defaultTitle} | ${siteName}`,
  description: defaultMetaDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultMetaDescription,
    url: siteUrl,
    siteName,
    locale: openGraphLocale,
    type: openGraphType,
    images: [
      {
        // url: `${siteUrl}${openGraphImage}`
        url: "https://cdn.pixabay.com/photo/2015/08/09/14/26/frog-881654_1280.jpg"
      }
    ],
  },
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
