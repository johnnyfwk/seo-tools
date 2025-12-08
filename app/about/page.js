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

if (!page) throw new Error(`Page not found: ${slug}`);

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

export default function About() {
    const aboutPageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                "url": siteUrl,
                "name": siteName,
                "publisher": {
                    "@id": `${siteUrl}#organization`
                },
                "inLanguage": "en-GB"
            },
            {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                "name": siteName,
                "url": siteUrl,
                "logo": `${siteUrl}${openGraphImage}`,
                "inLanguage": "en-GB"
            },
            {
                "@type": "AboutPage",
                "@id": `${siteUrl}about#aboutpage`,
                "url": page.canonicalUrl,
                "name": page.h1,
                "description": page.metaDescription,
                "isPartOf": {
                    "@id": `${siteUrl}#website`
                },
                "inLanguage": "en-GB"
            }
        ]
    };

    return (
        <section>
            <h1>{page.h1}</h1>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tristique urna tellus, sed dignissim enim aliquet eu. Nullam aliquet vitae enim vestibulum consequat. Aenean nisi nisl, vestibulum vitae pretium non, faucibus et nibh. Curabitur sed dolor non risus fringilla dictum sit amet id sem. Vestibulum vitae est eget magna semper dictum. Cras luctus mi et nulla rutrum egestas. Duis hendrerit ligula id est semper, fringilla varius lacus interdum. Cras dignissim risus sed nisi consequat varius.</p>

            <p>Morbi risus nibh, cursus sed auctor eget, faucibus in neque. Sed mattis auctor enim. Ut ut magna hendrerit, blandit enim non, maximus dolor. Ut sapien est, porta nec cursus vitae, accumsan eu tellus. Sed a rhoncus nunc. Etiam elementum in massa vitae congue. Etiam ut auctor eros, non dictum urna. Fusce eu enim at sapien varius pulvinar. Ut id porttitor leo. Vestibulum sem urna, volutpat ut augue eget, congue tempus sapien. Duis placerat hendrerit felis. Mauris sodales vestibulum erat, in tempus magna.</p>

            <p>Ut molestie lorem eu justo tincidunt convallis. Donec a tempus lectus. Cras vestibulum dolor lorem, nec vulputate nibh ullamcorper eget. Donec rutrum nunc eu nunc blandit, sed placerat augue rhoncus. In ut gravida lorem, a lacinia sem. Sed sed sapien hendrerit nulla pharetra bibendum in nec mauris. Integer ac dui sit amet tortor iaculis luctus. Phasellus facilisis dignissim risus nec dignissim. Aenean quis mauris sit amet ipsum molestie vestibulum. Sed pulvinar leo sed dui volutpat, a gravida risus commodo. Maecenas eu scelerisque tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas facilisis, quam non tincidunt fermentum, massa risus ornare sem, at eleifend velit massa sit amet nulla. Donec non tincidunt eros, a mattis ex.</p>

            <p>Sed a nisi eu mi pulvinar scelerisque. Nam rutrum sapien laoreet mauris iaculis feugiat. Proin mauris risus, tincidunt vel dui ut, convallis dictum urna. Vivamus commodo placerat turpis sit amet lacinia. Nullam et ultrices est. Proin eleifend nibh libero, ut elementum ligula porttitor sit amet. Vestibulum at dolor orci.</p>

            <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris non odio dignissim, ornare velit ac, faucibus justo. In vitae mauris nisi. Morbi pulvinar ligula a finibus tincidunt. Vivamus eu justo hendrerit, euismod lorem sit amet, bibendum ex. Quisque pellentesque enim at justo pretium, sed dignissim nisi bibendum. Pellentesque bibendum diam quam, eget auctor tellus posuere in. Donec at felis non nunc convallis fringilla id vitae ligula. Vestibulum laoreet ligula vel turpis commodo facilisis. Pellentesque eget semper tellus. Cras a semper mauris. Vestibulum eleifend rhoncus neque sit amet aliquet.</p>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
            />
        </section>
    )
}