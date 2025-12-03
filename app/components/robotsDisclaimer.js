import { useState } from "react";

export default function RobotsDisclaimer({ checked, onChange }) {
    const [showWarning, setShowWarning] = useState(false);

    function handleCheckboxChange(e) {
        onChange(e.target.checked);
        setShowWarning(e.target.checked);
    }

    return (
        <div>
            <input
                id="ignoreRobots"
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
            />

            <label htmlFor="ignoreRobots">Ignore robots.txt</label>

            {showWarning
                ? <div>
                    <p>⚠️ Warning ⚠️</p>
                    <p>By enabling "<em>Ignore robots.txt</em>", you are responsible for complying with the target website’s Terms of Service. This may violate the site’s rules regarding automated access.</p>
                    <p>You confirm you have permission to access and scrape this website.</p>
                    <p>We are not responsible for any legal consequences or blocking that may result.</p>
                </div>
                : null
            }
        </div>
    );
}
