import React from "react";

interface SecondaryButtonProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    width?: number | string;
    height?: number | string;
    marginTop?: number | string;
    marginBottom?: number | string;
}

// Sdílené obrysové tlačítko pro vedlejší akce ve formulářích a seznamech
const SecondaryButton: React.FC<SecondaryButtonProps> = ({
                                                             children,
                                                             onClick,
                                                             type = "button",
                                                             disabled = false,
                                                             width = "auto",
                                                             height = 40,
                                                             marginTop,
                                                             marginBottom,
                                                         }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                width,
                height,
                background: "none",
                color: disabled ? "#8aaa8a" : "#2d7a2d",
                border: disabled ? "1.5px solid #b7d3b7" : "1.5px solid #2d7a2d",
                borderRadius: 10,
                padding: "0 16px",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
                transition: "opacity 0.2s",
                marginTop,
                marginBottom,
            }}
            onMouseEnter={(e) => {
                if (!disabled) e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = disabled ? "0.6" : "1";
            }}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;