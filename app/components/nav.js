import Link from "next/link";

export default function Nav({ isNavVisible, setIsNavVisible }) {   
    const navStyle = {
        display: isNavVisible ? "grid" : "none",
    };

    function handleNavLinks() {
        setIsNavVisible(false);
    }

    return (
        <nav style={navStyle}>
            <div>
                <div>Tools</div>
                <div onClick={handleNavLinks} className="nav-section">
                    <Link href="/seo-on-page-checker">SEO On-Page Checker</Link>
                    <Link href="/robots-txt-checker">Robots.txt Checker</Link>
                    <Link href="/xml-sitemap-checker">XML Sitemap Checker</Link>
                    <Link href="/meta-robots-and-x-robots-tag-checker">Meta Robots & X-Robots Tag Checker</Link>
                    <Link href="/canonical-tag-checker">Canonical Tag Checker</Link>
                    <Link href="/viewport-meta-tag-checker">Viewport Meta Tag Checker</Link>
                    <Link href="/title-tag-and-meta-description-checker">Title Tag & Meta Description Length Checker</Link>
                    <Link href="/h1-tag-and-heading-structure-checker">H1 Tag & Heading Structure Checker</Link>
                    <Link href="/internal-and-external-link-anchor-text-and-broken-link-checker">Internal & External Link, Anchor Text & Broken Link Checker</Link>
                    <Link href="/image-alt-text-checker">Image Alt Text Checker</Link>
                    <Link href="/structured-data-checker">Structured Data Checker</Link>
                    <Link href="/hreflang-checker">Hreflang Checker</Link>
                    <Link href="/open-graph-checker">Open Graph Checker</Link>
                    <Link href="/pagination-checker">Pagination Checker</Link>
                    {/* <Link href="/internal-and-backlink-checker">Internal & Backlink Checker</Link> */}
                </div>
            </div>
            
            <div>
                <div>SEOTools</div>
                <div onClick={handleNavLinks} className="nav-section">
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </nav>
    )
}