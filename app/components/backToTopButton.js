'use client';
import { useState, useEffect } from 'react';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    // Show button after scrolling down 300px
    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <div
        style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            pointerEvents: 'none', // container does not block clicks
        }}
        >
            <button
                onClick={scrollToTop}
                style={{
                    pointerEvents: 'auto', // allow clicking the button
                    padding: '10px 15px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    // Ensure it never moves off viewport horizontally
                    maxWidth: 'calc(100vw - 40px)',
                    minWidth: '40px',
                }}
            >
                ↑ Top
            </button>
        </div>
    );
}
