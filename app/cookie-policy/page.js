import * as utils from '@/app/lib/utils/utils';
import { pages } from '@/data/pages';
import {
    siteUrl,
    siteName,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/site";

const slug = "cookie-policy";

const page = pages.find((p) => p.slug === slug);

export const metadata = utils.createMetadata(
    siteUrl,
    siteName,
    page,
    openGraphLocale,
    openGraphType,
    openGraphImage,
);

export default function CookiePolicy() {
    const cookiePolicyPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page.titleTag,
        "url": page.canonicalUrl,
        "publisher": {
            "@id": `${siteUrl}#organization`,
            "name": siteName,
            "logo": `${siteUrl}${openGraphImage}`
        }
    };

    return (
        <section>
            <h1>{page.h1}</h1>

            <p>
                <strong>Last Updated:</strong> 8 December 2025
            </p>

            <p>Our website {siteName} uses cookies to enhance your experience and provide you with relevant content and services. This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.</p>

            <h2>What are Cookies?</h2>

            <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help us improve the performance of our site, analyse usage, and provide personalised content and ads.</p>

            <h2>How Our Site Uses Cookies</h2>

            <p>The site uses the following types of cookies:</p>

            <ul>
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the site to function correctly. Without these cookies, certain services may be unavailable or may not work properly.</li>
                <li><strong>Performance and Analytics Cookies:</strong> These cookies help me understand how users interact with the site by collecting information such as which pages are visited most often. This data is anonymous and helps us improve user experience.</li>
                <li><strong>Referral Tracking Cookies:</strong> When you interact with the site or links provided on the site, referral tracking cookies may be used by third-party brands to ensure proper attribution for any actions taken (e.g., sign-ups, purchases).</li>
            </ul>

            <h2>Third-Party Cookies</h2>

            <p>The site may contain links to third-party brands, which may use cookies on their platforms. Please refer to the cookie policies of those brands for more information on how they use cookies.</p>

            <h2>Your Choices Regarding Cookies</h2>

            <p>You can manage your cookie preferences through your browser settings. You may choose to block or delete cookies, but please note that certain features of the site may not function as intended if cookies are disabled.</p>

            <p>To learn how to manage cookies, you can visit <a href="https://allaboutcookies.org/" target="_blank" rel="noreferrer noopener" className="page-link-colour">All About Cookies</a>.</p>

            <h2>Changes to this Cookie Policy</h2>

            <p>We may update this Cookie Policy from time to time. Any changes will be reflected on this page with a revised "Last updated" date.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(cookiePolicyPageSchema) }}
            />
        </section>
    )
}