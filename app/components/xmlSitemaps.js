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
                <p>
                    <strong>Robots.txt URL:</strong>{" "}
                    {xmlSitemaps.robotsTxtChecked
                        ? <Link href={xmlSitemaps.robotsTxtChecked} target="_blank" rel="noopener noreferrer">
                            {xmlSitemaps.robotsTxtChecked}
                        </Link>
                        : <span>N/A</span>
                    }
                </p>
            </div>
            
            <div>
                <p>
                    <strong>Sitemaps containing entered URL ({containing.length}):</strong>{" "}
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
                        : <span>URL not found in any sitemap.</span>
                    }
                </p>
            </div>

            <div>
                <strong>Sitemaps checked ({checked.length}):</strong>{" "}
                {checked.length > 0
                    ? <ul>
                        {checked.map(sitemap => (
                            <li key={sitemap}>
                                <Link href={sitemap} target="_blank" rel="noopener noreferrer">
                                    {sitemap}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    : <span>No sitemaps found.</span>
                }
            </div>
        </>
    )
}