import React from "react";

interface PracticeIconButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    title?: string;
    color?: string;
    background?: string;
    border?: string;
    size?: number;
    padding?: number | string;
}

// Sdílené ikonové tlačítko pro malé akce v detailu praxe a přílohách
const PracticeIconButton: React.FC<PracticeIconButtonProps> = ({
                                                                   children,
                                                                   onClick,
                                                                   title,
                                                                   color = "#e67e22",
                                                                   background = "none",
                                                                   border = "none",
                                                                   size = 28,
                                                                   padding = 0,
                                                               }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            style={{
                background,
                border,
                borderRadius: background === "none" ? 0 : 7,
                width: size,
                height: size,
                cursor: "pointer",
                color,
                padding,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            {children}
        </button>
    );
};

export default PracticeIconButton;