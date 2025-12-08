import {
    siteUrl,
    siteName,
    pages,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/pages";
import * as utils from '@/app/lib/utils/utils';

const slug = utils.getSlugFromFile(import.meta.url);

const page = pages.find((p) => p.slug === slug);

export const metadata = {
    robots: {
        index: page.robots.index,
        follow: page.robots.follow,
    },
    alternates: {
        canonical: page.canonicalUrl,
    },
    title: page.titleTag,
    description: page.metaDescription,
    openGraph: {
        title: page.titleTag,
        description: page.metaDescription,
        url: page.canonicalUrl,
        siteName,
        locale: openGraphLocale,
        type: openGraphType,
        images: [
            {
                url: `${siteUrl}${openGraphImage}`
            }
        ],
    },
}

export default function PrivacyPolicy() {
    const privacyPolicyPageSchema = {
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

            <p>{siteName} (“we”, “our”, or “us”) values your privacy. This Privacy Policy explains how we collect, use, and protect information when you use our website [{siteUrl}] and our SEO tools.</p>

            <h2>1. Information We Collect</h2>

            <p>We may collect:</p>

            <ul>
                <li><strong>Personal Information:</strong> Email addresses if you sign up for updates or newsletters.</li>
                <li><strong>Non-Personal Information:</strong> Browser type, IP address, pages visited, tool usage statistics, and cookies for analytics purposes.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>

            <p>We use information to:</p>

            <ul>
                <li>Provide, maintain, and improve our services.</li>
                <li>Communicate updates or promotional content (if you opt-in).</li>
                <li>Analyze website usage and performance.</li>
            </ul>

            <h2>3. Sharing Your Information</h2>

            <p>We do <strong>not</strong> sell your personal data. We may share information with:</p>

            <ul>
                <li>Service providers helping us operate the website.</li>
                <li>Legal authorities if required by law.</li>
            </ul>

            <h2>4. Cookies and Tracking</h2>

            <p>We use cookies and similar technologies to improve user experience. You can manage cookie settings via your browser.</p>

            <h2>5. Data Security</h2>

            <p>We implement reasonable security measures to protect your data but cannot guarantee absolute security.</p>

            <h2>6. Your Rights</h2>

            <p>Depending on your location, you may have rights to access, correct, or delete your personal data. Contact us at xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.</p>

            <h2>7. Changes to This Policy</h2>

            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyPolicyPageSchema) }}
            />
        </section>
    )
}