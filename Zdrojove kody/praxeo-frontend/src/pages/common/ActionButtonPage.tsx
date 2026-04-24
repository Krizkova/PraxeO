import React from "react";

interface ActionButtonPageProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const ActionButtonPage: React.FC<ActionButtonPageProps> = ({
                                                               children,
                                                               onClick,
                                                               type = "button",
                                                           }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{
                background: "none",
                border: "1.5px solid #2d7a2d",
                color: "#2d7a2d",
                borderRadius: 8,
                padding: "7px 18px",
                fontSize: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 500,
            }}
        >
            {children}
        </button>
    );
};

export default ActionButtonPage;