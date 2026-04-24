import React from "react";

interface FormCardProps {
    children: React.ReactNode;
    maxWidth?: number | string;
    padding?: number | string;
}

// Sdílená bílá karta pro formuláře a podobný obsah
const FormCard: React.FC<FormCardProps> = ({
                                               children,
                                               maxWidth = "100%",
                                               padding = 32,
                                           }) => {
    return (
        <div
            style={{
                width: "100%",
                maxWidth,
                background: "white",
                borderRadius: 18,
                border: "1px solid #e0ede0",
                padding,
                boxShadow: "0 4px 24px rgba(34,85,34,0.08)",
            }}
        >
            {children}
        </div>
    );
};

export default FormCard;