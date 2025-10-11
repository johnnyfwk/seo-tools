'use client';
import React from "react";

// Recursive component to display nested JSON
function JsonTree({ data, level = 0 }) {
    if (data === null || data === undefined) return <span>null</span>;

    if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
        return <span>{data.toString()}</span>;
    }

    if (Array.isArray(data)) {
        return (
            <ul>
                {data.map((item, idx) => (
                    <li key={idx}>
                        <JsonTree data={item} level={level + 1} />
                    </li>
                ))}
            </ul>
        );
    }

    if (typeof data === "object") {
        return (
            <ul>
                {Object.entries(data).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> <JsonTree data={value} level={level + 1} />
                    </li>
                ))}
            </ul>
        );
    }

    return <span>{data}</span>;
}

// Component to render all JSON-LD schemas
export default function JsonLdViewer({ jsonLdSchemas }) {
    if (!jsonLdSchemas || jsonLdSchemas.length === 0) {
        return <p>No JSON-LD schemas found on this page.</p>;
    }

    return (
        <div>
            <h3>Types Implemented:</h3>

            <ul style= {{ marginBottom: "10px"}}>
                {jsonLdSchemas.map((schema, index) => (
                    <li key={index}>
                        <a href={`#schema-${schema["@type"]}`}>
                            {schema["@type"]}
                        </a>
                    </li>
                ))}
            </ul>

            {jsonLdSchemas.map((schema, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: "2rem",
                        border: "1px solid #ccc",
                        padding: "1rem",
                        borderRadius: "8px"
                    }}
                    id={`schema-${schema["@type"]}`}
                >
                    <h3>Type: {schema["@type"] || "Unknown"}</h3>
                    <JsonTree data={schema} />
                </div>
            ))}
        </div>
    );
}