import Link from "next/link";
import { tools } from "@/data/tools";
import { siteName } from "@/data/site";

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
                ? <div className="nav-section">
                    <div className="nav-section-heading">Tools</div>
                    <div className="nav-section-links">
                        {tools.map((tool, i) => {
                            return (
                                <Link
                                    key={i}
                                    href={`/tools/${tool.slug}`}
                                    onClick={handleNavLinks}
                                >{tool.h1}</Link>
                            )
                        })}
                    </div>
                </div>
                : null
            }
            
            <div className="nav-section">
                <div className="nav-section-heading">{siteName}</div>
                <div onClick={handleNavLinks} className="nav-section-links">
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                </div>
            </div>
        </nav>
    )
}