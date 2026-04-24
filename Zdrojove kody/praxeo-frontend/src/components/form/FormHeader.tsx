import React from "react";
import { iconBoxStyle } from "./formStyles";

interface Props {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    marginBottom?: number;
}

const FormHeader: React.FC<Props> = ({
                                         icon,
                                         title,
                                         subtitle,
                                         badge,
                                         marginBottom = 24,
                                     }) => {
    return (
        <div
            style={{
                marginBottom,
                paddingBottom: 18,
                borderBottom: "1px solid #e8f5e9",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                }}
            >
                <div style={iconBoxStyle}>{icon}</div>

                <h2
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#1a3d1a",
                        margin: 0,
                    }}
                >
                    {title}
                </h2>
            </div>

            {subtitle && (
                <p style={{ fontSize: 13, color: "#6b8f6b", margin: "0 0 8px" }}>
                    {subtitle}
                </p>
            )}

            {badge}
        </div>
    );
};

export default FormHeader;