import Link from "next/link";

export default function XmlSitemaps({ xmlSitemaps }) {
    if (xmlSitemaps.hasSitemap === false) {
        return <p>No XML sitemaps found.</p>;
    }

    const containing = xmlSitemaps.sitemapsContainingUrl || [];
    const checked = xmlSitemaps.sitemapsChecked || [];
    
    return (
        <>
            <div>
                <strong>Robots.txt URL:</strong>
                <ul>
                    <li>
                        {xmlSitemaps.robotsTxtChecked
                            ? <Link href={xmlSitemaps.robotsTxtChecked} target="_blank" rel="noopener noreferrer">
                                {xmlSitemaps.robotsTxtChecked}
                            </Link>
                            : "N/A"
                        }
                    </li>
                </ul>
            </div>
            
            <div>
                <strong>Sitemaps containing URL ({containing.length}):</strong>
                {containing.length > 0
                    ? <ul>
                        {containing.map(sitemap => (
                            <li key={sitemap}>
                                <Link href={sitemap} target="_blank" rel="noopener noreferrer">
                                    {sitemap}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    : <p>URL not found in any sitemap.</p>
                }
            </div>

            <div>
                <strong>Sitemaps checked ({checked.length}):</strong>
                <ul>
                    {checked.map(sitemap => (
                        <li key={sitemap}>
                            <Link href={sitemap} target="_blank" rel="noopener noreferrer">
                                {sitemap}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}