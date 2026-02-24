import "./globals.css";
import Script from "next/script";
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
  openGraphImage
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
        url: `${siteUrl}${openGraphImage}`
      }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-E03GW5TD4R`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E03GW5TD4R', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
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
