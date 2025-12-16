import Link from "next/link";
import { tools } from "@/data/tools";

export default function Nav({ isNavVisible, setIsNavVisible }) {   
    const navStyle = {
        left: isNavVisible ? "0%" : "100%",
    };

    function handleNavLinks() {
        setIsNavVisible(false);
    }

    return (
        <nav style={navStyle}>
            {tools.length > 0
                ? <div onClick={handleNavLinks}>
                    <div className="nav-section-heading">
                        <Link href="/tools">Tools</Link>
                    </div>
                    <div className="nav-section">
                        {tools.map((tool, i) => {
                            return (
                                <Link key={i} href={`/tools/${tool.slug}`}>{tool.h1}</Link>
                            )
                        })}
                    </div>
                </div>
                : null
            }
            
            <div>
                <div className="nav-section-heading">SEOTools</div>
                <div onClick={handleNavLinks} className="nav-section">
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </nav>
    )
}