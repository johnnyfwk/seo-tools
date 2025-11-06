'use client';
import React from "react";

function renderValue(value) {
    if (value === null || value === undefined) return "null";

    if (Array.isArray(value)) {
        return value.map((v, i) => (
            <div key={i}>{renderValue(v)}</div>
        ));
    }

    if (typeof value === "object") {
        return (
            <div>
                {Object.entries(value).map(([k, v]) => (
                    <div key={k}>
                        <strong>{k}:</strong> {renderValue(v)}
                    </div>
                ))}
            </div>
        );
    }

    return value.toString();
}

export default function SchemaMarkup({ schemaMarkup }) {
    const jsonLdSchemas = schemaMarkup.filter(s => s.format === 'JSON-LD');

    if (!jsonLdSchemas.length) {
        return (
            <p>No JSON-LD schemas found.</p>
        );
    }

    return (
        <div>
            {jsonLdSchemas.map((schema, idx) => (
                <section key={idx}>
                    <h3>
                        Type: {Array.isArray(schema.raw['@type'])
                            ? schema.raw['@type'].join(', ')
                            : schema.raw['@type'] || "Unknown"}
                    </h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(schema.raw).map(([key, value]) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{renderValue(value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ))}
        </div>
    );
}
