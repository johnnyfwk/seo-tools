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
                        <strong>{k}:</strong> <RenderValue value={v} depth={depth + 1} />
                    </div>
                ))}
            </div>
        );
    }

    return <span>{value.toString()}</span>;
}

export default function SchemaMarkup({ schemaMarkup }) {
    if (!schemaMarkup || !schemaMarkup.length) {
        return <p>No schemas found.</p>;
    }

    // Use a Set to track which schema indices are expanded
    const [expanded, setExpanded] = useState(new Set());

    const toggleSchema = (idx) => {
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

    return (
        <div>
            {schemaMarkup.map((schema, idx) => (
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
                    <h4>
                        {Array.isArray(schema.raw['@type'])
                            ? schema.raw['@type'].join(', ')
                            : schema.raw['@type'] || schema.type || 'Unknown'
                        }
                        {schema.raw.name ? `: ${schema.raw.name}` : ''}
                    </h4>

                    <h5 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#555' }}>
                        {schema.format}
                    </h5>

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
                        onClick={() => toggleSchema(idx)}
                    >
                        {expanded.has(idx) ? 'Hide Details' : 'Show Details'}
                    </button>

                    {expanded.has(idx) && <RenderValue value={schema.raw} />}
                </div>
            ))}
        </div>
    );
}
