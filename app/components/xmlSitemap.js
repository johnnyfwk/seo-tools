import Link from "next/link";

export default function XmlSitemap({ xmlSitemap }) {
    if (!xmlSitemap.hasSitemap) {
        return <p>No XML sitemaps found.</p>;
    }

    const containing = xmlSitemap.sitemapsContainingUrl || [];
    const checked = xmlSitemap.sitemapsChecked || [];
    
    return (
        <>
            <section>
                <h3>Sitemaps containing URL ({containing.length}):</h3>
                {containing.length > 0 ? (
                    <ul>
                        {containing.map(sitemap => (
                            <li key={sitemap}>
                                <Link href={sitemap} target="_blank" rel="noopener noreferrer">
                                    {sitemap}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>URL not found in any sitemap.</p>
                )}
            </section>

            <section>
                <h3>XML Sitemaps Checked ({checked.length}):</h3>
                <ul>
                    {checked.map(sitemap => (
                        <li key={sitemap}>
                            <Link href={sitemap} target="_blank" rel="noopener noreferrer">
                                {sitemap}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h3>Robots.txt URL:</h3>
                <ul>
                    <li>
                        <Link href={xmlSitemap.robotsTxtChecked} target="_blank" rel="noopener noreferrer">
                            {xmlSitemap.robotsTxtChecked}
                        </Link>
                    </li>
                </ul>
            </section>
        </>
    )
}