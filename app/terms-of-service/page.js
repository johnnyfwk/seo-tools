import * as utils from '@/app/lib/utils/utils';
import { pages } from '@/data/pages';
import {
    siteUrl,
    siteName,
    openGraphLocale,
    openGraphType,
    openGraphImage
} from "@/data/site";

const slug = "terms-of-service";

const page = pages.find((p) => p.slug === slug);

export const metadata = utils.createMetadata(
    siteUrl,
    siteName,
    page,
    openGraphLocale,
    openGraphType,
    openGraphImage,
);

export default function TermsOfService() {
    const termsOfServicePageSchema = {
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

            <p>Welcome to {siteName} (“we”, “our”, or “us”). By using {siteUrl} and our tools, you agree to the following terms:</p>

            <h2>1. Use of Services</h2>

            <p>You may use our SEO tools only for lawful purposes. You agree not to:</p>

            <ul>
                <li>Attempt to access unauthorised data or systems.</li>
                <li>Use our services to harm others or violate applicable laws.</li>
            </ul>

            <h2>2. Limitation of Liability</h2>

            <p>Our tools provide data and insights for informational purposes only. We do not guarantee accuracy or specific results. You use the tools at your own risk.</p>

            <h2>3. Termination</h2>

            <p>We may suspend or terminate access to the website at any time for violations of these terms.</p>

            <h2>4. Governing Law</h2>

            <p>These terms are governed by the laws of the UK. Any disputes will be resolved in its courts.</p>

            <h2>5. Changes to Terms</h2>

            <p>We may update these Terms of Service at any time. Continued use of our website constitutes acceptance of the changes.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(termsOfServicePageSchema) }}
            />
        </section>
    )
}