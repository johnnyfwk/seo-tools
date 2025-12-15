'use client';

import React, { useState } from 'react';

// Recursive renderer for nested values
function RenderValue({ value, depth = 0 }) {
    if (value === null || value === undefined) return <span>null</span>;

    const indent = depth * 20;

    if (Array.isArray(value)) {
        return (
            <div style={{ marginLeft: indent }}>
                {value.map((v, i) => (
                    <RenderValue key={i} value={v} depth={depth + 1} />
                ))}
            </div>
        );
    }

    if (typeof value === 'object') {
        return (
            <div style={{ marginLeft: indent }}>
                {Object.entries(value).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 5 }}>
                        <strong>{k}:</strong>{' '}
                        {typeof v === 'object' ? (
                            <RenderValue value={v} depth={depth + 1} />
                        ) : (
                            <span>{v?.toString() ?? 'null'}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return <span style={{ marginLeft: indent }}>{value.toString()}</span>;
}

export default function StructuredData({ structuredData }) {
    if (!structuredData || !structuredData.length) {
        return <p>No structured data found.</p>;
    }

    // Use a Set to track which structured data indices are expanded
    const [expanded, setExpanded] = useState(new Set());

    const toggleStructuredData = (idx) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) {
                newSet.delete(idx);
            } else {
                newSet.add(idx);
            }
            return newSet;
        });
    };

    let numberOfJsonLdSchema = 0;
    let numberOfMicrodataSchema = 0;
    let numberofRdfaSchema = 0;
    
    structuredData.forEach((schema) => {
        if (schema.format.toLowerCase() === 'json-ld') {
            numberOfJsonLdSchema++;
        } else if (schema.format.toLowerCase() === 'microdata') {
            numberOfMicrodataSchema++;
        } else if (schema.format.toLowerCase() === 'rdfa') {
            numberofRdfaSchema++;
        }
    });

    return (
        <div>
            <div>
                <p>Formats found:</p>
                <ul>
                    <li>
                        <strong>JSON-LD:</strong> {numberOfJsonLdSchema}
                    </li>
                    <li>
                        <strong>Microdata:</strong> {numberOfMicrodataSchema}
                    </li>
                    <li>
                        <strong>RDFa:</strong> {numberofRdfaSchema}
                    </li>
                </ul>
            </div>
            {structuredData.map((structuredData, idx) => (
                <div
                    key={idx}
                    style={{
                        border: '1px solid #ccc',
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <h3>
                        {Array.isArray(structuredData.raw['@type'])
                            ? structuredData.raw['@type'].join(', ')
                            : structuredData.raw['@type'] || structuredData.type || 'Unknown'
                        }
                        {structuredData.raw.name ? `: ${structuredData.raw.name}` : ''}
                    </h3>

                    <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#555' }}>
                        {structuredData.format}
                    </h4>

                    <button
                        style={{
                            marginBottom: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                        onClick={() => toggleStructuredData(idx)}
                    >
                        {expanded.has(idx) ? 'Hide Details' : 'Show Details'}
                    </button>

                    {expanded.has(idx) && <RenderValue value={structuredData.raw} />}
                </div>
            ))}
        </div>
    );
}
