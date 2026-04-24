import React from "react";
import { labelStyle } from "./formStyles";
import FormHint from "./FormHint";

interface Props {
    label?: string;
    htmlFor?: string;
    required?: boolean;
    error?: React.ReactNode;
    hint?: React.ReactNode;
    hintVariant?: "default" | "muted";
    marginBottom?: number;
    children: React.ReactNode;
}

const FormField: React.FC<Props> = ({
                                        label,
                                        htmlFor,
                                        required = false,
                                        error,
                                        hint,
                                        hintVariant = "default",
                                        marginBottom = 16,
                                        children,
                                    }) => {
    return (
        <div style={{ marginBottom }}>
            {/* Popisek formulářového pole */}
            {label && (
                <label htmlFor={htmlFor} style={labelStyle}>
                    {label}
                    {required && (
                        <span style={{ color: "#e24b4a", marginLeft: 4 }}>*</span>
                    )}
                </label>
            )}

            {/* Obsah pole, například input nebo select */}
            {children}

            {/* Chybová nebo pomocná zpráva pod polem */}
            {error ? (
                <FormHint variant="error">{error}</FormHint>
            ) : hint ? (
                <FormHint variant={hintVariant}>{hint}</FormHint>
            ) : null}
        </div>
    );
};

export default FormField;