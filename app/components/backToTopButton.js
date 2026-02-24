'use client';

import { useState, useEffect } from 'react';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0 });
    };

    if (!visible) return null;

    return (
        <button
            id="back-to-top-button"
            onClick={scrollToTop}
        >↑</button>
    );
}
