"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isCookieConsentBannerVisible, setIsCookieConsentBannerVisible] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setIsCookieConsentBannerVisible(true);
        }
    }, []);

    function handleAcceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsCookieConsentBannerVisible(false);
    };

    if (!isCookieConsentBannerVisible) {
        return null;
    }

    return (
        <div id="cookie-consent-banner">
            <p>This website uses cookies to ensure you get the best experience. Learn more by visiting our <Link href="/cookie-policy" id="cookie-consent-message">Cookie Policy</Link> page.</p>

            <button
                id="accept-cookies"
                onClick={handleAcceptCookies}
            >Continue</button>
        </div>
    )
}